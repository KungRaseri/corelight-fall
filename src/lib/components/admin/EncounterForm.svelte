<script lang="ts">
	import type { EncounterFormData } from '$lib/types/EncounterFormData';
	import type { QuestFormData } from '$lib/types/QuestFormData';
	import { onMount } from 'svelte';

	const { encounter, quests, loading, onSave, onCancel } = $props();

	let encounterData = $state<EncounterFormData>({
		id: null,
		questId: 0,
		title: '',
		description: '',
		type: '',
		order: 0
	});

	let questsData = $state<QuestFormData[]>([]);

	function handleSubmit(e: Event) {
		e.preventDefault();
		onSave({ ...encounterData });
	}

	onMount(() => {
		encounterData = { ...encounter };
		questsData = [...quests];
	});
</script>

<form
	class="bg-surface-200-800 text-surface-900-100 mx-auto max-w-2xl space-y-6 rounded-lg p-8 shadow-lg"
	onsubmit={handleSubmit}
>
	<h2 class="mb-4 text-2xl font-bold">{encounterData.id ? 'Edit Encounter' : 'New Encounter'}</h2>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div>
			<label class="mb-1 block font-semibold" for="title">Title</label>
			<input
				id="title"
				type="text"
				class="input w-full"
				bind:value={encounterData.title}
				required
			/>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="order">Order</label>
			<input
				id="order"
				type="number"
				class="input w-full"
				bind:value={encounterData.order}
				min="0"
			/>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="type">Type</label>
			<select
				id="type"
				class="input bg-surface-200-800 text-surface-900-100 w-full"
				bind:value={encounterData.type}
				required
			>
				<option value="" disabled>Select type</option>
				<option value="combat">Combat</option>
				<option value="dialogue">Dialogue</option>
				<option value="puzzle">Puzzle</option>
				<option value="story">Story</option>
			</select>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="questId">Quest</label>
			<select
				id="questId"
				class="input bg-surface-200-800 text-surface-900-100 w-full"
				bind:value={encounterData.questId}
				required
			>
				<option value="" disabled>Select quest</option>
				{#each quests as quest}
					<option value={quest.id}>{quest.title}</option>
				{/each}
			</select>
		</div>
		<div class="md:col-span-2">
			<label class="mb-1 block font-semibold" for="description">Description</label>
			<textarea
				id="description"
				class="input w-full"
				bind:value={encounterData.description}
				rows="3"
			></textarea>
		</div>
	</div>
	<div class="mt-4 flex gap-4">
		<button class="btn btn-primary" type="submit" disabled={loading}>
			{loading ? 'Saving...' : 'Save Encounter'}
		</button>
		<button class="btn btn-secondary" onclick={onCancel}>Cancel</button>
	</div>
</form>
