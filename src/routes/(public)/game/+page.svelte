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

	function handleChoice(choice: ChoiceFormData) {
		// Handle the player's choice here
		console.log('Player chose:', choice);
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
								<button class="btn btn-primary w-full" onclick={chooseStory(s.id)}>
									{s.title}
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{:else}
				<PlayerStoryView
					storyline={data.currentStoryline}
					currentQuest={data.currentQuest}
					currentEncounter={data.currentEncounter}
					availableChoices={data.availableChoices}
					onChoose={handleChoice}
				/>
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
