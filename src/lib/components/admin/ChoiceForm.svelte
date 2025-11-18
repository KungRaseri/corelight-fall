<script lang="ts">
	import type { ChoiceFormData } from '$lib/types/ChoiceFormData';
	import type { EncounterFormData } from '$lib/types/EncounterFormData';
	import { onMount } from 'svelte';

	const { choice, encounters, onSave, onCancel, loading } = $props();

	let choiceData = $state<ChoiceFormData>({
		id: null,
		encounterId: null,
		text: '',
		nextEncounterId: null,
		outcome: '',
		order: 0,
		createdAt: new Date(),
		updatedAt: new Date()
	});

	let encountersData = $state<EncounterFormData[]>([]);

	function handleSubmit(e: Event) {
		e.preventDefault();
		onSave({ ...choiceData });
	}

	onMount(() => {
		choiceData = { ...choice };
		encountersData = [...encounters];
	});
</script>

<form
	class="bg-surface-800 text-surface-100 mx-auto max-w-2xl space-y-6 rounded-lg p-8 shadow-lg"
	onsubmit={handleSubmit}
>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div>
			<label class="mb-1 block font-semibold" for="text">Text</label>
			<input id="text" type="text" class="input w-full" bind:value={choiceData.text} required />
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="order">Order</label>
			<input id="order" type="number" class="input w-full" bind:value={choiceData.order} min="0" />
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="encounterId">Encounter</label>
			<select
				id="encounterId"
				class="input bg-surface-800 text-surface-100 w-full"
				bind:value={choiceData.encounterId}
				required
			>
				<option value="" disabled>Select encounter</option>
				{#each encounters as encounter}
					<option value={encounter.id}>{encounter.title}</option>
				{/each}
			</select>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="nextEncounterId">Next Encounter</label>
			<select
				id="nextEncounterId"
				class="input bg-surface-800 text-surface-100 w-full"
				bind:value={choiceData.nextEncounterId}
			>
				<option value="">None</option>
				{#each encounters as encounter}
					<option value={encounter.id}>{encounter.title}</option>
				{/each}
			</select>
		</div>
		<div class="md:col-span-2">
			<label class="mb-1 block font-semibold" for="outcome">Outcome</label>
			<textarea id="outcome" class="input w-full" bind:value={choiceData.outcome} rows="3"
			></textarea>
		</div>
	</div>
	<div class="mt-4 flex gap-4">
		<button class="btn preset-filled-primary-500" type="submit" disabled={loading}>
			{loading ? 'Saving...' : 'Save Choice'}
		</button>
		<button class="btn preset-tonal-secondary" type="button" onclick={onCancel}>Cancel</button>
	</div>
</form>






