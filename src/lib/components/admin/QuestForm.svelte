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
		isMainQuest: false,
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
	<h2 class="mb-4 text-2xl font-bold">{questData.id ? 'Edit Quest' : 'New Quest'}</h2>
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
			<input
				id="isMainQuest"
				type="checkbox"
				class="checkbox"
				bind:checked={questData.isMainQuest}
			/>
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
	</div>
	<div class="mt-4 flex gap-4">
		<button class="btn btn-primary" type="submit" disabled={loading}>
			{loading ? 'Saving...' : 'Save Quest'}
		</button>
		<button class="btn btn-secondary" onclick={onCancel}>Cancel</button>
	</div>
</form>
