<script lang="ts">
	import type { QuestFormData } from '$lib/types/QuestFormData';
	// Use default import for SvelteFlow to avoid SSR directory import error
	import { SvelteFlow } from '@xyflow/svelte';

	const { acts, phases, quests, encounters, choices } = $props();

	let nodes = $state([]);
	let edges = $state([]);

	// Filter phases for the selected act
	let filteredPhases = $state([]);

	$effect(() => {
		nodes = quests.map((q: QuestFormData, i: number) => ({
			id: `quest-${q.id}`,
			position: { x: 100, y: i * 120 },
			data: { label: q.title },
			type: 'default'
		}));
		// Edges: connect quests to their first encounter, etc.
		// ...

		if (acts && phases && selectedActId != null) {
			filteredPhases = phases.filter((p) => p.actId === selectedActId);
		} else {
			filteredPhases = [];
		}
	});
</script>

<div class="bg-surface-200 h-[600px] w-full rounded border">
	<SvelteFlow {nodes} {edges} fitView />
</div>

<style>
	/* Add custom styles for node types, etc. */
</style>

<!-- When rendering the phase select list in StorylineForm or PhaseForm, use filteredPhases instead of phases -->
<!-- Example:
<select ...>
  {#each filteredPhases as phase}
    <option value={phase.id}>{phase.title}</option>
  {/each}
</select>
-->
