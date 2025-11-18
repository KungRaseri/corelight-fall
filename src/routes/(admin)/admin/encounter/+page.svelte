<script lang="ts">
	import EncounterForm from '$lib/components/admin/EncounterForm.svelte';
	import type { EncounterFormData } from '$lib/types/EncounterFormData';
	import type { QuestFormData } from '$lib/types/QuestFormData';
	import { onMount } from 'svelte';

	const { data } = $props();

	let encounters = $state<EncounterFormData[]>([]);
	let quests = $state<QuestFormData[]>([]);
	let showForm = $state(false);
	let editingEncounter = $state<EncounterFormData | null>(null);
	let viewingEncounter = $state<EncounterFormData | null>(null);
	let loading = $state(true);
	let error = $state('');

	function addEncounter() {
		editingEncounter = {
			id: null,
			questId: 0,
			title: '',
			type: 'combat',
			order: 0,
			description: '',
			summary: '',
			tags: '',
			tone: '',
			factions: '',
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		showForm = true;
	}

	function editEncounter(encounter: EncounterFormData) {
		editingEncounter = { ...encounter };
		showForm = true;
	}

	function viewEncounter(encounter: EncounterFormData) {
		viewingEncounter = { ...encounter };
		showForm = false;
	}

	async function handleSave(newEncounter: EncounterFormData) {
		loading = true;
		error = '';
		const method = newEncounter.id ? 'PUT' : 'POST';

		const res = await fetch('/api/admin/encounter', {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newEncounter)
		});
		let saved: EncounterFormData;
		if (!res.ok) {
			error = 'Failed to save encounter';
		} else {
			saved = (await res.json()).encounter;
			showForm = false;
			const exists = encounters.some((e) => e.id === saved.id);
			if (exists) {
				encounters = encounters.map((e) => (e.id === saved.id ? { ...e, ...saved } : e));
			} else {
				encounters = [saved, ...encounters];
			}
		}
		loading = false;
	}

	onMount(() => {
		encounters = [...data.encounters];
		quests = [...data.quests];
		loading = false;
	});
</script>

{#if showForm}
	<EncounterForm
		encounter={editingEncounter}
		{quests}
		{loading}
		onSave={handleSave}
		onCancel={() => (showForm = false)}
	/>
{:else if viewingEncounter}
	<div class="bg-surface-800 text-surface-100 mx-auto max-w-xl space-y-6 rounded-lg p-8 shadow-lg">
		<h2 class="mb-4 text-2xl font-bold">Encounter Details</h2>
		<div class="mb-4">
			<span class="font-semibold">Title:</span>
			<span class="ml-2">{viewingEncounter.title}</span>
		</div>
		<div class="mb-4">
			<span class="font-semibold">Type:</span>
			<span class="ml-2">{viewingEncounter.type}</span>
		</div>
		<div class="mb-4">
			<span class="font-semibold">Order:</span>
			<span class="ml-2">{viewingEncounter.order}</span>
		</div>
		<div class="mb-4">
			<span class="font-semibold">Description:</span>
			<div class="ml-2 whitespace-pre-line">{viewingEncounter.description}</div>
		</div>
		<div class="mt-6 flex gap-4">
			<button class="btn preset-glass-secondary" onclick={() => (viewingEncounter = null)}>Go Back</button>
			<button
				class="btn preset-glass-primary"
				onclick={() => {
					editingEncounter = viewingEncounter;
					showForm = true;
					viewingEncounter = null;
				}}>Edit</button
			>
		</div>
	</div>
{:else}
	<h1 class="mb-4 text-2xl font-bold">Encounters</h1>
	<button class="btn preset-glass-primary mb-4" onclick={addEncounter}>Add New Encounter</button>
	{#if loading}
		<p>Loading...</p>
	{:else}
		<table class="bg-surface-800 w-full table-auto border-collapse rounded shadow">
			<thead>
				<tr>
					<th class="px-3 py-2 text-left">Title</th>
					<th class="px-3 py-2 text-left">Type</th>
					<th class="px-3 py-2 text-left">Order</th>
					<th class="px-3 py-2 text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each encounters as encounter}
					<tr class="border-surface-700 hover:bg-surface-700 border-t transition">
						<td class="px-3 py-2">{encounter.title}</td>
						<td class="px-3 py-2">{encounter.type}</td>
						<td class="px-3 py-2">{encounter.order}</td>
						<td class="flex gap-2 px-3 py-2">
							<button class="btn preset-glass-primary px-1 py-0.5 text-xs" onclick={() => editEncounter(encounter)}
								>Edit</button
							>
							<button class="btn preset-glass-secondary px-1 py-0.5 text-xs" onclick={() => viewEncounter(encounter)}
								>View</button
							>
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






