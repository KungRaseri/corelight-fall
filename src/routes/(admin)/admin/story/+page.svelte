<script lang="ts">
	import StorylineForm from '$lib/components/admin/StorylineForm.svelte';
	import type { StorylineFormData } from '$lib/types/StorylineFormData';
	import { onMount } from 'svelte';

	const { data } = $props();

	let storylines = $state<StorylineFormData[]>([]);
	let showForm = $state(false);
	let editingStoryline = $state<StorylineFormData | null>(null);
	let loading = $state(true);
	let error = $state('');

	function addStoryline() {
		editingStoryline = null;
		showForm = true;
	}

	function editStoryline(storyline: StorylineFormData) {
		editingStoryline = { ...storyline };
		showForm = true;
	}

	async function handleSave(newStoryline: StorylineFormData) {
		loading = true;
		error = '';
		const method = newStoryline.id ? 'PUT' : 'POST';

		const res = await fetch('/api/admin/storyline', {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newStoryline)
		});
		let storyline: StorylineFormData;
		if (!res.ok) {
			error = 'Failed to save storyline';
		} else {
			storyline = (await res.json()).storyline;
			showForm = false;
			const exists = storylines.some((p) => p.id === storyline.id);
			if (exists) {
				// Editing: update the storyline in the array
				storylines = storylines.map((p) => (p.id === storyline.id ? { ...p, ...storyline } : p));
			} else {
				// Creating: add the new storyline to the top of the list
				storylines = [storyline, ...storylines];
			}
		}
		loading = false;
	}

	onMount(async () => {
		storylines = [...data.storylines];
		loading = false;
	});
</script>

<h1 class="mb-4 text-2xl font-bold">Storylines</h1>
{#if showForm}
	<StorylineForm
		storyline={editingStoryline ?? {
			id: null,
			title: '',
			description: '',
			isMain: false
		}}
		{loading}
		onSave={handleSave}
	/>
	<button class="btn btn-secondary" onclick={() => (showForm = false)}>Cancel</button>
{:else}
	<button class="btn btn-primary mb-4" onclick={addStoryline}>Add New Storyline</button>
	{#if loading}
		<p>Loading...</p>
	{:else}
		<table class="bg-surface-800 w-full table-auto border-collapse rounded shadow">
			<thead>
				<tr>
					<th class="px-3 py-2 text-left">Title</th>
					<th class="px-3 py-2 text-left">Main?</th>
					<th class="px-3 py-2 text-left">Description</th>
					<th class="px-3 py-2 text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each storylines as storyline}
					<tr class="border-surface-700 hover:bg-surface-700 border-t transition">
						<td class="px-3 py-2">{storyline.title}</td>
						<td class="px-3 py-2">{storyline.isMain ? 'Yes' : 'No'}</td>
						<td class="px-3 py-2">{storyline.description}</td>
						<td class="flex gap-2 px-3 py-2">
							<button class="btn btn-xs btn-primary" onclick={() => editStoryline(storyline)}
								>Edit</button
							>
							<!-- Add view/delete as needed -->
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
{/if}

{#if error}
	<p class="mt-2 text-red-500">{error}</p>
{/if}
