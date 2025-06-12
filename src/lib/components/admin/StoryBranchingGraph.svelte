<script lang="ts">
	import type { QuestFormData } from '$lib/types/QuestFormData';
	// Use default import for SvelteFlow to avoid SSR directory import error
	import { SvelteFlow } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';

	const { acts, phases, quests, encounters, choices } = $props();

	let nodes = $state<any[]>([]);
	let edges = $state<any[]>([]);

	$effect(() => {
		if (quests && quests.length > 0) {
			nodes = quests.map((q: QuestFormData, i: number) => ({
				id: `quest-${q.id}`,
				position: { x: 100, y: i * 120 },
				data: { label: q.title },
				type: 'default'
			}));
			// TODO: Add edges for encounters/choices if needed
			edges = [];
		} else {
			nodes = [
				{ id: 'empty', position: { x: 100, y: 100 }, data: { label: 'No Quests' }, type: 'default' }
			];
			edges = [];
		}
	});
</script>

<div class="bg-surface-200-800 h-[600px] w-full rounded border">
	<SvelteFlow {nodes} {edges} fitView style="height:100%;width:100%" class="!bg-surface-200-800" />
</div>

<style>
	/* Add custom styles for node types, etc. */
</style>
