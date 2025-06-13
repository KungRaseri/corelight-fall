<script lang="ts">
	import type { QuestFormData } from '$lib/types/QuestFormData';
	import { Background, Controls, SvelteFlow, type ColorMode } from '@xyflow/svelte';
	import { colorMode as colorModeStore } from '$lib/stores/colorMode';

	const { acts, phases, quests, encounters, choices } = $props();

	let nodes = $state<any[]>([]);
	let edges = $state<any[]>([]);
	let colorMode = $state<ColorMode>('light');

	$effect(() => {
		// Subscribe to colorMode store for real-time updates
		const unsubscribe = colorModeStore.subscribe((mode) => {
			colorMode = mode as ColorMode;
		});

		if (quests && quests.length > 0) {
			const sortedQuests = [...quests].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
			nodes = sortedQuests.map((q: QuestFormData, i: number) => ({
				id: `quest-${q.id}`,
				position: { x: 100, y: i * 120 },
				data: { label: q.title },
				type: 'default'
			}));
			edges = sortedQuests.slice(0, -1).map((q, i) => ({
				id: `edge-quest-${q.id}-to-${sortedQuests[i + 1].id}`,
				source: `quest-${q.id}`,
				target: `quest-${sortedQuests[i + 1].id}`,
				type: 'default'
			}));
		} else {
			nodes = [
				{ id: 'empty', position: { x: 100, y: 100 }, data: { label: 'No Quests' }, type: 'default' }
			];
			edges = [];
		}

		return unsubscribe;
	});
</script>

<div class="bg-surface-200-800 h-[600px] w-full rounded border">
	<SvelteFlow {colorMode} {nodes} {edges} fitView style="height:100%;width:100%">
		<Background />
		<Controls />
	</SvelteFlow>
</div>
