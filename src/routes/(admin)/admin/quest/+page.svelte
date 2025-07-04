<script lang="ts">
	import QuestForm from '$lib/components/admin/QuestForm.svelte';
	import type { QuestFormData } from '$lib/types/QuestFormData';
	import { onMount } from 'svelte';

	const { data } = $props();

	let showForm = $state(false);
	let quests = $state<QuestFormData[]>([]);
	let editingQuest = $state<QuestFormData | null>(null);
	let error = $state('');
	let loading = $state(true);

	function addQuest() {
		editingQuest = {
			id: null,
			storylineId: 0,
			title: '',
			description: '',
			order: 0,
			isMainQuest: false
		};
		showForm = true;
	}

	function editQuest(quest: QuestFormData) {
		editingQuest = { ...quest };
		showForm = true;
	}

	async function handleSave(newQuest: QuestFormData) {
		loading = true;
		error = '';
		const method = newQuest.id ? 'PUT' : 'POST';

		const res = await fetch('/api/admin/quest', {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newQuest)
		});
		let quest: QuestFormData;
		if (!res.ok) {
			error = 'Failed to save quest';
		} else {
			quest = (await res.json()).quest;
			showForm = false;
			const exists = quests.some((q) => q.id === quest.id);
			if (exists) {
				quests = quests.map((q) => (q.id === quest.id ? { ...q, ...quest } : q));
			} else {
				quests = [quest, ...quests];
			}
		}
		loading = false;
	}

	onMount(async () => {
		quests = [...data.quests];
		loading = false;
	});
</script>

<h1 class="mb-4 text-2xl font-bold">Quests</h1>
{#if showForm}
	<QuestForm
		quest={editingQuest}
		{loading}
		onSave={handleSave}
		onCancel={() => (showForm = false)}
	/>
{:else}
	<button class="btn btn-primary mb-4" onclick={addQuest}>Add New Quest</button>
	{#if loading}
		<p>Loading...</p>
	{:else}
		<table class="bg-surface-800 w-full table-auto border-collapse rounded shadow">
			<thead>
				<tr>
					<th class="px-3 py-2 text-left">Title</th>
					<th class="px-3 py-2 text-left">Storyline</th>
					<th class="px-3 py-2 text-left">Main?</th>
					<th class="px-3 py-2 text-left">Order</th>
					<th class="px-3 py-2 text-left">Description</th>
					<th class="px-3 py-2 text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each quests as quest}
					<tr class="border-surface-700 hover:bg-surface-700 border-t transition">
						<td class="px-3 py-2">{quest.title}</td>
						<td class="px-3 py-2">{quest.storylineId}</td>
						<td class="px-3 py-2">{quest.isMainQuest ? 'Yes' : 'No'}</td>
						<td class="px-3 py-2">{quest.order}</td>
						<td class="px-3 py-2">{quest.description}</td>
						<td class="flex gap-2 px-3 py-2">
							<button class="btn btn-xs btn-primary" onclick={() => editQuest(quest)}>Edit</button>
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
