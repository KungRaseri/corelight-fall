<script lang="ts">
	import type { QuestFormData } from '$lib/types/QuestFormData';
	import { onMount } from 'svelte';

	const { quest, loading, onSave, onCancel } = $props();

	let questData = $state<QuestFormData>({
		id: null,
		storylineId: 0,
		title: '',
		description: '',
		order: 0,
		isMain: false,
		factions: '',
		tags: '',
		tone: '',
		goals: '',
		isActive: false,
		summary: '',
		encounters: [],
		createdAt: new Date(),
		updatedAt: new Date()
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		onSave({ ...questData });
	}

	onMount(() => {
		questData = { ...quest };
	});
</script>

<form
	class="bg-surface-800 text-surface-100 mx-auto max-w-2xl space-y-6 rounded-lg p-8 shadow-lg"
	onsubmit={handleSubmit}
>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div class="md:col-span-2">
			<label class="mb-1 block font-semibold" for="title">Title</label>
			<input id="title" type="text" class="input w-full" bind:value={questData.title} required />
		</div>
		<div class="md:col-span-2">
			<label class="mb-1 block font-semibold" for="description">Description</label>
			<textarea id="description" class="input w-full" bind:value={questData.description} rows="3"
			></textarea>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="order">Order</label>
			<input id="order" type="number" class="input w-full" bind:value={questData.order} min="0" />
		</div>
		<div class="flex items-center gap-3">
			<input id="isMainQuest" type="checkbox" class="checkbox" bind:checked={questData.isMain} />
			<label for="isMainQuest" class="font-semibold">Main Quest</label>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="storylineId">Storyline ID</label>
			<input
				id="storylineId"
				type="number"
				class="input w-full"
				bind:value={questData.storylineId}
				required
				disabled={questData.storylineId !== 0 || questData.storylineId !== null}
			/>
			<!-- Replace with a select dropdown if you want to show storyline titles -->
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="tone">Tone</label>
			<input id="tone" type="text" class="input w-full" bind:value={questData.tone} />
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="goals">Goals</label>
			<textarea id="goals" class="input w-full" bind:value={questData.goals} rows="2"></textarea>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="summary">Summary</label>
			<textarea id="summary" class="input w-full" bind:value={questData.summary} rows="2"
			></textarea>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="tags">Tags</label>
			<input
				id="tags"
				type="text"
				class="input w-full"
				bind:value={questData.tags}
				placeholder="comma,separated"
			/>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="factions">Factions</label>
			<input
				id="factions"
				type="text"
				class="input w-full"
				bind:value={questData.factions}
				placeholder="comma,separated"
			/>
		</div>
		<div class="flex items-center gap-3">
			<input id="isActive" type="checkbox" class="checkbox" bind:checked={questData.isActive} />
			<label for="isActive" class="font-semibold">Active</label>
		</div>
	</div>
	<div class="mt-4 flex gap-4">
		<button class="btn preset-glass-primary" type="submit" disabled={loading}>
			{loading ? 'Saving...' : 'Save Quest'}
		</button>
		<button class="btn preset-glass-secondary" onclick={onCancel}>Cancel</button>
	</div>
</form>






