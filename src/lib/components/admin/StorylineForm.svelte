<script lang="ts">
	import type { StorylineFormData } from '$lib/types/StorylineFormData';
	import { onMount } from 'svelte';

	const { storyline, loading, onSave } = $props();

	let storylineData = $state<StorylineFormData>({
		id: null,
		title: '',
		description: '',
		isMain: false
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		onSave({ ...storylineData });
	}

	onMount(() => {
		storylineData = { ...storyline };
	});
</script>

<form
	class="bg-surface-800 text-surface-100 mx-auto max-w-2xl space-y-6 rounded-lg p-8 shadow-lg"
	onsubmit={handleSubmit}
>
	<h2 class="mb-4 text-2xl font-bold">{storylineData.id ? 'Edit Storyline' : 'New Storyline'}</h2>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
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
		<div class="flex items-center gap-3 md:col-span-2">
			<input id="isMain" type="checkbox" class="checkbox" bind:checked={storylineData.isMain} />
			<label for="isMain" class="font-semibold">Main Storyline</label>
		</div>
	</div>
	<div class="mt-4 flex gap-4">
		<button class="btn btn-primary" type="submit" disabled={loading}>
			{loading ? 'Saving...' : 'Save Storyline'}
		</button>
	</div>
</form>
