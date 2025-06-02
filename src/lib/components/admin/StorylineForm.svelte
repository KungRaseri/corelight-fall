<script lang="ts">
	import type { StorylineFormData } from '$lib/types/StorylineFormData';
	import { onMount } from 'svelte';

	const {
		storyline,
		loading,
		onSave,
		onCancel,
		acts = [],
		phases = [],
		onAddAct,
		onAddPhase
	} = $props();

	let storylineData = $state<StorylineFormData>({
		id: null,
		title: '',
		description: '',
		phaseId: null,
		tone: '',
		goals: '',
		summary: '',
		tags: '',
		factions: '',
		order: 0,
		isMain: false,
		isActive: true,
		coverImage: '',
		createdAt: new Date(),
		updatedAt: new Date(),
		quests: []
	});

	let selectedActId = $state<number | null>(null);
	let selectedPhaseId = $state<number | null>(null);

	// Filter phases based on selected act
	const filteredPhases = $derived(
		selectedActId ? phases.filter((p) => p.actId === selectedActId) : phases
	);

	function handleSubmit(e: Event) {
		e.preventDefault();
		onSave({ ...storylineData });
	}

	onMount(() => {
		storylineData = { ...storyline };
		const currentPhase = phases.find((p) => p.id === storylineData.phaseId);
		if (currentPhase) selectedActId = currentPhase.actId;
	});
</script>

<form
	class="bg-surface-200-800 text-surface-900-100 mx-auto max-w-2xl space-y-6 rounded-lg p-8 shadow-lg"
	onsubmit={handleSubmit}
>
	<h2 class="mb-4 text-2xl font-bold">{storylineData.id ? 'Edit Storyline' : 'New Storyline'}</h2>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Act selection and add -->
		<div>
			<label class="mb-1 block font-semibold" for="act">Act</label>
			<div class="flex gap-2">
				<select
					id="act"
					class="input input-bordered bg-surface-200-800 text-surface-900-100 w-full"
					bind:value={selectedActId}
					required
				>
					<option value="" disabled selected>Select act</option>
					{#each acts as act}
						<option value={act.id}>{act.title}</option>
					{/each}
				</select>
				<button type="button" class="btn btn-xs btn-primary" onclick={onAddAct}>+ Act</button>
			</div>
		</div>
		<!-- Phase selection and add -->
		<div>
			<label class="mb-1 block font-semibold" for="phase">Phase</label>
			<div class="flex gap-2">
				<select
					id="phase"
					class="input input-bordered bg-surface-200-800 text-surface-900-100 w-full"
					bind:value={storylineData.phaseId}
					required
				>
					<option value="" disabled selected>Select phase</option>
					{#each filteredPhases as phase}
						<option value={phase.id}>{phase.title}</option>
					{/each}
				</select>
				<button type="button" class="btn btn-xs btn-primary" onclick={onAddPhase}> + Phase </button>
			</div>
		</div>
		<div class="md:col-span-2">
			<label class="mb-1 block font-semibold" for="title">Title</label>
			<input
				id="title"
				type="text"
				class="input w-full"
				bind:value={storylineData.title}
				required
			/>
		</div>
		<div class="md:col-span-2">
			<label class="mb-1 block font-semibold" for="description">Description</label>
			<textarea
				id="description"
				class="input w-full"
				bind:value={storylineData.description}
				rows="3"
			></textarea>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="order">Order</label>
			<input
				id="order"
				type="number"
				class="input w-full"
				bind:value={storylineData.order}
				min="0"
			/>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="tone">Tone</label>
			<input id="tone" type="text" class="input w-full" bind:value={storylineData.tone} />
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="goals">Goals</label>
			<textarea id="goals" class="input w-full" bind:value={storylineData.goals} rows="2"
			></textarea>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="summary">Summary</label>
			<textarea id="summary" class="input w-full" bind:value={storylineData.summary} rows="2"
			></textarea>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="tags">Tags</label>
			<input
				id="tags"
				type="text"
				class="input w-full"
				bind:value={storylineData.tags}
				placeholder="comma,separated"
			/>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="factions">Factions</label>
			<input
				id="factions"
				type="text"
				class="input w-full"
				bind:value={storylineData.factions}
				placeholder="comma,separated"
			/>
		</div>
		<div class="md:col-span-2">
			<label class="mb-1 block font-semibold" for="coverImage">Cover Image</label>
			<input
				id="coverImage"
				type="text"
				class="input w-full"
				bind:value={storylineData.coverImage}
				placeholder="Image URL"
			/>
		</div>
		<div class="flex items-center gap-3 md:col-span-2">
			<input id="isMain" type="checkbox" class="checkbox" bind:checked={storylineData.isMain} />
			<label for="isMain" class="font-semibold">Main Storyline</label>
			<input id="isActive" type="checkbox" class="checkbox" bind:checked={storylineData.isActive} />
			<label for="isActive" class="font-semibold">Active</label>
		</div>
	</div>
	<div class="mt-4 flex gap-4">
		<button class="btn btn-primary" type="submit" disabled={loading}>
			{loading ? 'Saving...' : 'Save Storyline'}
		</button>
		<button class="btn btn-secondary" type="button" onclick={onCancel}>Cancel</button>
	</div>
</form>
