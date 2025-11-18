<script lang="ts">
	import { Background, Controls, SvelteFlow, type ColorMode } from '@xyflow/svelte';
	import { colorMode as colorModeStore } from '$lib/stores/colorMode';

	// Custom node components
	import QuestNode from './QuestNode.svelte';
	import EncounterNode from './EncounterNode.svelte';
	import ChoiceNode from './ChoiceNode.svelte';
	import ColoredEdge from './ColoredEdge.svelte';

	const { acts, phases, quests, encounters, choices } = $props();

	let nodes = $state<any[]>([]);
	let edges = $state<any[]>([]);
	let colorMode = $state<ColorMode>('light');

	const nodeTypes = {
		quest: QuestNode,
		encounter: EncounterNode,
		choice: ChoiceNode
	};
	const edgeTypes = {
		colored: ColoredEdge as any // workaround for SvelteFlow/xyflow type mismatch in runes mode
	};

	$effect(() => {
		const unsubscribe = colorModeStore.subscribe((mode) => {
			colorMode = mode as ColorMode;
		});

		if (quests && quests.length > 0) {
			const sortedQuests = [...quests].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
			const newNodes: any[] = [];
			const nodeIds = new Set<string>();

			// --- First pass: build all nodes and collect IDs ---
			for (const [i, q] of sortedQuests.entries()) {
				const questNodeId = `quest-${q.id}`;
				nodeIds.add(questNodeId);
				newNodes.push({
					id: questNodeId,
					position: { x: 100, y: i * 200 },
					data: { label: q.title, ...q },
					type: 'quest'
				});

				if (q.encounters && q.encounters.length > 0) {
					for (const [j, e] of q.encounters.entries()) {
						const encounterNodeId = `encounter-${e.id}`;
						nodeIds.add(encounterNodeId);
						newNodes.push({
							id: encounterNodeId,
							position: { x: 350, y: i * 200 + j * 100 },
							data: { label: e.title, ...e },
							type: 'encounter'
						});
						if (e.choices && e.choices.length > 0) {
							for (const [k, c] of e.choices.entries()) {
								const choiceNodeId = `choice-${c.id}`;
								nodeIds.add(choiceNodeId);
								newNodes.push({
									id: choiceNodeId,
									position: { x: 600, y: i * 200 + j * 100 + k * 60 },
									data: { label: c.text, ...c },
									type: 'choice'
								});
							}
						}
					}
				}
			}

			// --- Second pass: build all edges, only if both nodes exist ---
			const newEdges: any[] = [];
			function getEdgeColor(sourceId: string) {
				if (sourceId.startsWith('quest-')) return '#34d399'; // emerald-400
				if (sourceId.startsWith('encounter-')) return '#38bdf8'; // sky-400
				if (sourceId.startsWith('choice-')) return '#fbbf24'; // amber-400
				return '#a3a3a3'; // neutral fallback
			}
			function safePushEdge(edge: any, sourceId: string, targetId: string) {
				if (nodeIds.has(sourceId) && nodeIds.has(targetId)) {
					newEdges.push({
						...edge,
						type: 'colored',
						sourceHandle: null,
						targetHandle: null,
						style: { stroke: getEdgeColor(sourceId), strokeWidth: 2 }
					});
				} else {
					console.warn(
						`[StoryBranchingGraph] Skipping edge ${edge.id} because source or target node is missing. Source: ${sourceId}, Target: ${targetId}`
					);
				}
			}
			for (const [i, q] of sortedQuests.entries()) {
				const questNodeId = `quest-${q.id}`;
				if (q.encounters && q.encounters.length > 0) {
					for (const [j, e] of q.encounters.entries()) {
						const encounterNodeId = `encounter-${e.id}`;
						// Edge from quest to first encounter only
						if (j === 0) {
							safePushEdge(
								{
									id: `edge-quest-${q.id}-encounter-${e.id}`,
									source: questNodeId,
									target: encounterNodeId
								},
								questNodeId,
								encounterNodeId
							);
						}
						// Connect encounters in order
						if (j > 0) {
							const prev = q.encounters[j - 1];
							const prevId = `encounter-${prev.id}`;
							safePushEdge(
								{
									id: `edge-encounter-${prev.id}-to-${e.id}`,
									source: prevId,
									target: encounterNodeId
								},
								prevId,
								encounterNodeId
							);
						}
						// Add choice edges for this encounter
						if (e.choices && e.choices.length > 0) {
							for (const [k, c] of e.choices.entries()) {
								const choiceNodeId = `choice-${c.id}`;
								// Edge from encounter to each choice
								safePushEdge(
									{
										id: `edge-encounter-${e.id}-choice-${c.id}`,
										source: encounterNodeId,
										target: choiceNodeId
									},
									encounterNodeId,
									choiceNodeId
								);
								// If this choice leads to another encounter, connect it
								if (c.nextEncounterId) {
									const nextEncounterNodeId = `encounter-${c.nextEncounterId}`;
									safePushEdge(
										{
											id: `edge-choice-${c.id}-to-encounter-${c.nextEncounterId}`,
											source: choiceNodeId,
											target: nextEncounterNodeId
										},
										choiceNodeId,
										nextEncounterNodeId
									);
								}
							}
						}
					}
				}
			}
			// Connect quests in order
			for (let i = 0; i < sortedQuests.length - 1; i++) {
				const sourceId = `quest-${sortedQuests[i].id}`;
				const targetId = `quest-${sortedQuests[i + 1].id}`;
				safePushEdge(
					{
						id: `edge-quest-${sortedQuests[i].id}-to-${sortedQuests[i + 1].id}`,
						source: sourceId,
						target: targetId
					},
					sourceId,
					targetId
				);
			}

			nodes = newNodes;
			edges = newEdges;
		} else {
			nodes = [
				{ id: 'empty', position: { x: 100, y: 100 }, data: { label: 'No Quests' }, type: 'default' }
			];
			edges = [];
		}

		return unsubscribe;
	});
</script>

<div class="bg-surface-200 dark:bg-surface-800 h-[600px] w-full rounded border">
	<SvelteFlow
		{colorMode}
		{nodes}
		{edges}
		{nodeTypes}
		{edgeTypes}
		fitView
		style="height:100%;width:100%"
	>
		<Background />
		<Controls />
	</SvelteFlow>
</div>






