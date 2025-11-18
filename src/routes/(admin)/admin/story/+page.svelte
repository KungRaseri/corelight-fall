<script lang="ts">
	import StorylineForm from '$lib/components/admin/StorylineForm.svelte';
	import type { QuestFormData } from '$lib/types/QuestFormData';
	import type { StorylineFormData } from '$lib/types/StorylineFormData';
	import { onMount } from 'svelte';

	const { data } = $props();

	let storylines = $state<StorylineFormData[]>([]);
	let quests = $state<QuestFormData[]>([]);
	let showForm = $state(false);
	let editingStoryline = $state<StorylineFormData | null>(null);
	let viewingStoryline = $state<StorylineFormData | null>(null);
	let loading = $state(true);
	let error = $state('');

	function addStoryline() {
		editingStoryline = {
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
			updatedAt: new Date()
		};
		showForm = true;
	}

	function editStoryline(storyline: StorylineFormData) {
		editingStoryline = { ...storyline };
		showForm = true;
	}

	function viewStoryline(storyline: StorylineFormData) {
		viewingStoryline = { ...storyline };
		showForm = false;
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
		quests = [...data.quests];
		loading = false;
	});
</script>

{#if showForm}
	<StorylineForm
		storyline={editingStoryline}
		{loading}
		onSave={handleSave}
		onCancel={() => (showForm = false)}
		onSelectAct={() => {}}
		onAddAct={() => {}}
		onAddPhase={() => {}}
	/>
{:else if viewingStoryline}
	<div class="bg-surface-800 text-surface-100 mx-auto max-w-xl space-y-6 rounded-lg p-8 shadow-lg">
		<h2 class="mb-4 text-2xl font-bold">Storyline Details</h2>
		<div class="mb-4">
			<span class="font-semibold">Title:</span>
			<span class="ml-2">{viewingStoryline.title}</span>
		</div>
		<div class="mb-4">
			<span class="font-semibold">Main Storyline:</span>
			<span class="ml-2">{viewingStoryline.isMain ? 'Yes' : 'No'}</span>
		</div>
		<div class="mb-4">
			<span class="font-semibold">Description:</span>
			<div class="ml-2 whitespace-pre-line">{viewingStoryline.description}</div>
		</div>
		<div class="mb-4">
			<span class="font-semibold">Quests:</span>
			<ul class="ml-4 list-disc">
				{#each quests.filter((q) => q.storylineId === viewingStoryline?.id) as quest}
					<li>
						<span class="font-bold">{quest.title}</span>
						<span class="text-surface-400 ml-2 text-sm">{quest.description}</span>
					</li>
				{:else}
					<li class="text-surface-400">No quests for this storyline.</li>
				{/each}
			</ul>
		</div>
		<div class="mt-6 flex gap-4">
			<button class="btn preset-glass-secondary" onclick={() => (viewingStoryline = null)}>Go Back</button>
			<button
				class="btn preset-glass-primary"
				onclick={() => {
					editingStoryline = viewingStoryline;
					showForm = true;
					viewingStoryline = null;
				}}>Edit</button
			>
		</div>
	</div>
{:else}
	<h1 class="mb-4 text-2xl font-bold">Storylines</h1>
	<button class="btn preset-glass-primary mb-4" onclick={addStoryline}>Add New Storyline</button>
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
							<button class="btn preset-glass-primary px-1 py-0.5 text-xs" onclick={() => editStoryline(storyline)}
								>Edit</button
							>
							<button class="btn preset-glass-secondary px-1 py-0.5 text-xs" onclick={() => viewStoryline(storyline)}
								>View</button
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






