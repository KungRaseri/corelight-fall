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
		order: 0,
		tone: '',
		summary: '',
		tags: '',
		factions: '',
		isActive: true,
		xpReward: 0,
		goldReward: 0,
		choices: [],
		createdAt: new Date(),
		updatedAt: new Date()
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
	class="bg-surface-200 dark:bg-surface-800 text-surface-900 dark:text-surface-100 mx-auto max-w-2xl space-y-6 rounded-lg p-8 shadow-lg"
	onsubmit={handleSubmit}
>
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
				class="input bg-surface-200 dark:bg-surface-800 text-surface-900 dark:text-surface-100 w-full"
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
				class="input bg-surface-200 dark:bg-surface-800 text-surface-900 dark:text-surface-100 w-full"
				bind:value={encounterData.questId}
				required
			>
				<option value="" disabled>Select quest</option>
				{#each quests as quest}
					<option value={quest.id}>{quest.title}</option>
				{/each}
			</select>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="tone">Tone</label>
			<input id="tone" type="text" class="input w-full" bind:value={encounterData.tone} />
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="summary">Summary</label>
			<textarea id="summary" class="input w-full" bind:value={encounterData.summary} rows="2"
			></textarea>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="tags">Tags</label>
			<input
				id="tags"
				type="text"
				class="input w-full"
				bind:value={encounterData.tags}
				placeholder="comma,separated"
			/>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="factions">Factions</label>
			<input
				id="factions"
				type="text"
				class="input w-full"
				bind:value={encounterData.factions}
				placeholder="comma,separated"
			/>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="xpReward">XP Reward</label>
			<input
				id="xpReward"
				type="number"
				class="input w-full"
				bind:value={encounterData.xpReward}
				min="0"
			/>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="goldReward">Gold Reward</label>
			<input
				id="goldReward"
				type="number"
				class="input w-full"
				bind:value={encounterData.goldReward}
				min="0"
			/>
		</div>
		<div class="flex items-center gap-3">
			<input id="isActive" type="checkbox" class="checkbox" bind:checked={encounterData.isActive} />
			<label for="isActive" class="font-semibold">Active</label>
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
		<button class="btn preset-glass-primary" type="submit" disabled={loading}>
			{loading ? 'Saving...' : 'Save Encounter'}
		</button>
		<button class="btn preset-glass-secondary" onclick={onCancel}>Cancel</button>
	</div>
</form>






