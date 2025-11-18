<script lang="ts">
	import Recap from '$lib/components/Recap.svelte';
	import CharacterAttributes from '$lib/components/gameplay/CharacterAttributes.svelte';
	import PlayerStoryView from '$lib/components/gameplay/PlayerStoryView.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { character, setCharacterAttributes } from '$lib/stores/character';
	import type { ChoiceFormData } from '$lib/types/ChoiceFormData.js';
	import { onMount } from 'svelte';

	let showCharacter = $state(false);
	let showMap = $state(false);
	let showQuests = $state(false);
	let showLog = $state(false);

	const { data } = $props();
	let outcome = $state<string | null>(null);
	let awaitingContinue = $state(false);

	function handleChoice(choice: ChoiceFormData) {
		// Simulate showing the outcome for the selected choice
		outcome = choice.outcome ?? 'You made a choice.';
		awaitingContinue = true;
		// In a real app, you would also update the quest/encounter state here
	}

	function handleContinue() {
		outcome = null;
		awaitingContinue = false;
		// In a real app, fetch the next encounter/quest here
		console.log('Continue to next encounter!');
	}

	async function chooseStory(storylineId: number) {
		const res = await fetch('/api/game/select-storyline', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ storylineId })
		});
		if (res.ok) {
			window.location.reload();
		}
	}

	onMount(() => {
		if (data.character) {
			character.set(data.character);
		}
		if (data.attributes) {
			setCharacterAttributes(data.attributes);
		}
	});
</script>

<div class="space-y-8 p-8">
	<!-- Quick Status Bar (optional, add your own stats here) -->
	<!--
	<div class="flex gap-6 items-center mb-4">
		<span class="font-bold">HP: {data.character?.hp ?? '--'}</span>
		<span class="font-bold">XP: {data.character?.xp ?? '--'}</span>
		<span class="font-bold">Gold: {data.character?.gold ?? '--'}</span>
	</div>
	-->

	<!-- Modal Activation Buttons -->
	<div class="mb-8 flex flex-auto justify-between gap-4">
		<button class="btn preset-filled-surface-400-600" onclick={() => (showCharacter = true)}
			>Character Info</button
		>
		<button class="btn preset-filled-surface-400-600" onclick={() => (showMap = true)}>Map</button>
		<button class="btn preset-filled-surface-400-600" onclick={() => (showQuests = true)}
			>Quests</button
		>
		<button class="btn preset-filled-surface-400-600" onclick={() => (showLog = true)}
			>Activity Log</button
		>
	</div>

	<!-- Main Scene Content Area -->
	<div
		class="bg-surface-400-600 text-surface-900-100 flex min-h-[300px] flex-col items-center justify-center rounded-lg p-6 shadow-lg"
	>
		<h2 class="mb-2 text-2xl font-bold">Current Scene</h2>
		<div class="text-lg">
			{#if !data.currentStoryline}
				<div class="mx-auto max-w-xl p-6">
					<h2 class="mb-4 text-xl font-bold">Choose Your Story</h2>
					<ul class="space-y-2">
						{#each data.storylines ?? [] as s}
							<li>
								<button class="btn preset-filled-primary-500 w-full" onclick={() => chooseStory(s.id)}>
									{s.title}
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{:else if data.currentQuest && data.currentEncounter}
				<div
					class="bg-surface-100-900 border-surface-200-800 mx-auto max-w-xl rounded-xl border p-6 shadow"
				>
					<div class="text-surface-500-400 mb-2 text-xs tracking-wider uppercase">Quest</div>
					<div class="text-surface-900-100 mb-1 text-2xl font-bold">{data.currentQuest.title}</div>
					<div class="text-surface-800-200 mb-4 text-base">{data.currentQuest.description}</div>
					<div class="text-surface-500-400 mb-2 text-xs tracking-wider uppercase">Encounter</div>
					<div class="text-surface-900-100 mb-2 text-lg font-semibold">
						{data.currentEncounter.title}
					</div>
					<div class="text-surface-800-200 mb-4 text-base">{data.currentEncounter.description}</div>
					{#if data.availableChoices && data.availableChoices.length > 0}
						{#if outcome && awaitingContinue}
							<div
								class="bg-surface-200-800 text-surface-900-100 mt-4 rounded p-4 text-center font-semibold shadow"
							>
								{outcome}
							</div>
							<button class="btn preset-filled-primary-500 mx-auto mt-4" onclick={handleContinue}>Continue</button
							>
						{:else}
							<div class="mt-4 flex flex-col gap-2">
								{#each data.availableChoices as choice}
									<button
										onclick={() => handleChoice(choice)}
										class="bg-amber-400-600 border-amber-300-700 text-surface-900-100 rounded border-2 px-4 py-2 font-semibold shadow transition hover:border-amber-400 hover:bg-amber-500"
									>
										{choice.text}
									</button>
								{/each}
							</div>
						{/if}
					{:else}
						<div class="text-green-700-300 mt-4 font-semibold">Encounter complete!</div>
					{/if}
				</div>
			{:else}
				<div class="text-surface-500-400 text-center text-lg">No active quest.</div>
			{/if}
		</div>
		<!-- Add scene actions, choices, or visuals here -->
	</div>

	<!-- Recap/Recent Activity -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		<Recap />
		<!-- <CurrentQuest /> -->
		<!-- <CurrentLocation /> -->
	</div>
</div>

<!-- Modals -->
<Modal open={showCharacter} onClose={() => (showCharacter = false)}>
	<CharacterAttributes />
</Modal>

<!-- <Modal open={showMap} onClose={() => (showMap = false)}>
	<Map />
</Modal>
<Modal open={showQuests} onClose={() => (showQuests = false)}>
	<Quest />
</Modal>
<Modal open={showLog} onClose={() => (showLog = false)}>
	<ActivityLog />
</Modal> -->






