<script lang="ts">
	import ChoiceForm from '$lib/components/admin/ChoiceForm.svelte';
	import type { ChoiceFormData } from '$lib/types/ChoiceFormData';
	import type { EncounterFormData } from '$lib/types/EncounterFormData';
	import { onMount } from 'svelte';

	const { data } = $props();

	let choices = $state<ChoiceFormData[]>([]);
	let encounters = $state<EncounterFormData[]>([]);
	let showForm = $state(false);
	let editingChoice = $state<ChoiceFormData | null>(null);
	let viewingChoice = $state<ChoiceFormData | null>(null);
	let loading = $state(true);
	let error = $state('');

	function addChoice() {
		editingChoice = {
			id: null,
			encounterId: null,
			text: '',
			nextEncounterId: null,
			outcome: '',
			order: 0,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		showForm = true;
	}

	function editChoice(choice: ChoiceFormData) {
		editingChoice = { ...choice };
		showForm = true;
	}

	function viewChoice(choice: ChoiceFormData) {
		viewingChoice = { ...choice };
		showForm = false;
	}

	async function handleSave(newChoice: ChoiceFormData) {
		loading = true;
		error = '';
		const method = newChoice.id ? 'PUT' : 'POST';

		const res = await fetch('/api/admin/choice', {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newChoice)
		});
		let saved: ChoiceFormData;
		if (!res.ok) {
			error = 'Failed to save choice';
		} else {
			saved = (await res.json()).choice;
			showForm = false;
			const exists = choices.some((c) => c.id === saved.id);
			if (exists) {
				choices = choices.map((c) => (c.id === saved.id ? { ...c, ...saved } : c));
			} else {
				choices = [saved, ...choices];
			}
		}
		loading = false;
	}

	onMount(() => {
		choices = [...data.choices];
		encounters = [...data.encounters];
		loading = false;
	});
</script>

{#if showForm}
	<ChoiceForm
		choice={editingChoice}
		{encounters}
		{loading}
		onSave={handleSave}
		onCancel={() => (showForm = false)}
	/>
{:else if viewingChoice}
	<div class="bg-surface-800 text-surface-100 mx-auto max-w-xl space-y-6 rounded-lg p-8 shadow-lg">
		<h2 class="mb-4 text-2xl font-bold">Choice Details</h2>
		<div class="mb-4">
			<span class="font-semibold">Text:</span>
			<span class="ml-2">{viewingChoice.text}</span>
		</div>
		<div class="mb-4">
			<span class="font-semibold">Order:</span>
			<span class="ml-2">{viewingChoice.order}</span>
		</div>
		<div class="mb-4">
			<span class="font-semibold">Outcome:</span>
			<span class="ml-2">{viewingChoice.outcome}</span>
		</div>
		<div class="mb-4">
			<span class="font-semibold">Encounter:</span>
			<span class="ml-2">
				{#if encounters.length && viewingChoice}
					{#each encounters.filter((e) => e.id === viewingChoice!.encounterId) as encounter}
						{encounter.title}
					{:else}
						Unknown
					{/each}
				{:else}
					Unknown
				{/if}
			</span>
		</div>
		<div class="mb-4">
			<span class="font-semibold">Next Encounter:</span>
			<span class="ml-2">
				{#if encounters.length && viewingChoice && viewingChoice.nextEncounterId}
					{#each encounters.filter((e) => e.id === viewingChoice!.nextEncounterId) as encounter}
						{encounter.title}
					{:else}
						None
					{/each}
				{:else}
					None
				{/if}
			</span>
		</div>
		<div class="mt-6 flex gap-4">
			<button class="btn preset-glass-secondary" onclick={() => (viewingChoice = null)}>Go Back</button>
			<button
				class="btn preset-glass-primary"
				onclick={() => {
					editingChoice = viewingChoice;
					showForm = true;
					viewingChoice = null;
				}}>Edit</button
			>
		</div>
	</div>
{:else}
	<h1 class="mb-4 text-2xl font-bold">Choices</h1>
	<button class="btn preset-glass-primary mb-4" onclick={addChoice}>Add New Choice</button>
	{#if loading}
		<p>Loading...</p>
	{:else}
		<table class="bg-surface-800 w-full table-auto border-collapse rounded shadow">
			<thead>
				<tr>
					<th class="px-3 py-2 text-left">Text</th>
					<th class="px-3 py-2 text-left">Order</th>
					<th class="px-3 py-2 text-left">Encounter</th>
					<th class="px-3 py-2 text-left">Next Encounter</th>
					<th class="px-3 py-2 text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each choices as choice}
					<tr class="border-surface-700 hover:bg-surface-700 border-t transition">
						<td class="px-3 py-2">{choice.text}</td>
						<td class="px-3 py-2">{choice.order}</td>
						<td class="px-3 py-2">
							{#if encounters.length}
								{#each encounters.filter((e) => e.id === choice.encounterId) as encounter}
									{encounter.title}
								{:else}
									Unknown
								{/each}
							{:else}
								Unknown
							{/if}
						</td>
						<td class="px-3 py-2">
							{#if encounters.length && choice.nextEncounterId}
								{#each encounters.filter((e) => e.id === choice.nextEncounterId) as encounter}
									{encounter.title}
								{:else}
									None
								{/each}
							{:else}
								None
							{/if}
						</td>
						<td class="flex gap-2 px-3 py-2">
							<button class="btn preset-glass-primary px-1 py-0.5 text-xs" onclick={() => editChoice(choice)}>Edit</button
							>
							<button class="btn preset-glass-secondary px-1 py-0.5 text-xs" onclick={() => viewChoice(choice)}
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






