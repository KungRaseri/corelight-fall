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
		xpReward: 0,
		goldReward: 0,
		requiresCheck: null,
		checkDifficulty: 10,
		failureOutcome: null,
		failureXpReward: 0,
		failureGoldReward: 0,
		failureNextEncounterId: null,
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
		<div>
			<label class="mb-1 block font-semibold" for="xpReward">XP Reward</label>
			<input id="xpReward" type="number" class="input w-full" bind:value={choiceData.xpReward} min="0" />
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="goldReward">Gold Reward</label>
			<input id="goldReward" type="number" class="input w-full" bind:value={choiceData.goldReward} min="0" />
		</div>
	</div>

	<!-- Skill Check Section -->
	<div class="border-t border-surface-600 pt-6">
		<h3 class="mb-4 text-lg font-bold text-primary-400">Skill Check (Optional)</h3>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label class="mb-1 block font-semibold" for="requiresCheck">Attribute Check</label>
				<select
					id="requiresCheck"
					class="input bg-surface-800 text-surface-100 w-full"
					bind:value={choiceData.requiresCheck}
				>
					<option value="">None (No Check)</option>
					<option value="Vigor">Vigor</option>
					<option value="Nerve">Nerve</option>
					<option value="Finesse">Finesse</option>
					<option value="Ingenuity">Ingenuity</option>
					<option value="Presence">Presence</option>
					<option value="Guile">Guile</option>
					<option value="Sync">Sync</option>
				</select>
			</div>
			<div>
				<label class="mb-1 block font-semibold" for="checkDifficulty">Difficulty (DC)</label>
				<input id="checkDifficulty" type="number" class="input w-full" bind:value={choiceData.checkDifficulty} min="1" />
			</div>
		</div>

		{#if choiceData.requiresCheck}
			<div class="mt-6 space-y-4">
				<div class="card preset-glass-surface bg-surface-700 p-4">
					<h4 class="mb-3 text-sm font-bold text-success-400">On Success</h4>
					<p class="text-xs text-surface-300 mb-2">Uses the Outcome, XP Reward, and Gold Reward above, plus Next Encounter</p>
				</div>

				<div class="card preset-glass-surface bg-surface-700 p-4">
					<h4 class="mb-3 text-sm font-bold text-error-400">On Failure</h4>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="md:col-span-2">
							<label class="mb-1 block font-semibold text-sm" for="failureOutcome">Failure Outcome</label>
							<textarea id="failureOutcome" class="input w-full" bind:value={choiceData.failureOutcome} rows="3"
							></textarea>
						</div>
						<div>
							<label class="mb-1 block font-semibold text-sm" for="failureXpReward">Failure XP</label>
							<input id="failureXpReward" type="number" class="input w-full" bind:value={choiceData.failureXpReward} min="0" />
						</div>
						<div>
							<label class="mb-1 block font-semibold text-sm" for="failureGoldReward">Failure Gold</label>
							<input id="failureGoldReward" type="number" class="input w-full" bind:value={choiceData.failureGoldReward} min="0" />
						</div>
						<div class="md:col-span-2">
							<label class="mb-1 block font-semibold text-sm" for="failureNextEncounterId">Failure Next Encounter</label>
							<select
								id="failureNextEncounterId"
								class="input bg-surface-800 text-surface-100 w-full"
								bind:value={choiceData.failureNextEncounterId}
							>
								<option value="">Same as Success</option>
								{#each encounters as encounter}
									<option value={encounter.id}>{encounter.title}</option>
								{/each}
							</select>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<div class="mt-4 flex gap-4">
		<button class="btn preset-glass-primary" type="submit" disabled={loading}>
			{loading ? 'Saving...' : 'Save Choice'}
		</button>
		<button class="btn preset-glass-secondary" type="button" onclick={onCancel}>Cancel</button>
	</div>
</form>






