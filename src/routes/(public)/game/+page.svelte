<script lang="ts">
	import Recap from '$lib/components/Recap.svelte';
	import CharacterAttributes from '$lib/components/gameplay/CharacterAttributes.svelte';
	import PlayerStoryView from '$lib/components/gameplay/PlayerStoryView.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import WorldIntroduction from '$lib/components/game/WorldIntroduction.svelte';
	import StoryPrologue from '$lib/components/game/StoryPrologue.svelte';
	import ArcChoice from '$lib/components/game/ArcChoice.svelte';
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

	async function advanceIntroStage(stage: string) {
		const res = await fetch('/api/game/advance-intro', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ stage })
		});
		if (res.ok) {
			window.location.reload();
		}
	}

	async function chooseArc(arcChoice: 'trust' | 'investigate') {
		const res = await fetch('/api/game/choose-arc', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ arcChoice })
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

<div class="container mx-auto max-w-7xl space-y-6 p-4 md:p-8">
	<!-- Quick Actions Bar -->
	<div class="flex flex-wrap gap-2 md:gap-4">
		<button 
			class="btn preset-tonal-surface flex items-center gap-2" 
			onclick={() => (showCharacter = true)}
		>
			<span>Character</span>
		</button>
		<button 
			class="btn preset-tonal-surface flex items-center gap-2" 
			onclick={() => (showMap = true)}
		>
			<span>Map</span>
		</button>
		<button 
			class="btn preset-tonal-surface flex items-center gap-2" 
			onclick={() => (showQuests = true)}
		>
			<span>Quests</span>
		</button>
		<button 
			class="btn preset-tonal-surface flex items-center gap-2" 
			onclick={() => (showLog = true)}
		>
			<span>Activity Log</span>
		</button>
	</div>

	<!-- Main Story Content -->
	<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 min-h-[400px] p-6 md:p-8">
		<!-- Intro Stages -->
		{#if data.introStage === null || data.introStage === 'tutorial_complete'}
			<!-- World Introduction -->
			<WorldIntroduction onContinue={() => advanceIntroStage('world_intro')} />
		{:else if data.introStage === 'world_intro'}
			<!-- Story Prologue -->
			<StoryPrologue onContinue={() => advanceIntroStage('story_prologue')} />
		{:else if data.introStage === 'story_prologue'}
			<!-- Arc Choice -->
			<ArcChoice onChoice={chooseArc} />
		{:else}
			<!-- Main Game Content -->
			<h1 class="mb-6 text-3xl md:text-4xl font-bold text-primary-500 dark:text-primary-400">Adventure</h1>
		
			<div class="text-lg">
				{#if !data.currentStoryline}
					<!-- Storyline Selection -->
					<div class="mx-auto max-w-2xl">
						<h2 class="mb-6 text-2xl font-bold text-primary-500 dark:text-primary-400">Choose Your Path</h2>
						<div class="space-y-3">
							{#each data.storylines ?? [] as s}
								<button 
									class="card preset-outlined-surface-200-800 hover:preset-tonal-primary w-full p-4 text-left transition-all duration-200" 
									onclick={() => chooseStory(s.id)}
								>
									<h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100">{s.title}</h3>
									{#if s.description}
										<p class="mt-2 text-surface-700 dark:text-surface-300">{s.description}</p>
									{/if}
								</button>
							{/each}
						</div>
					</div>
			{:else if data.currentQuest && data.currentEncounter}
				<!-- Active Quest/Encounter -->
				<div class="mx-auto max-w-3xl space-y-6">
					<!-- Quest Info -->
					<div class="card preset-outlined-surface-200-800 bg-surface-100 dark:bg-surface-800 p-6">
						<div class="mb-2 text-xs tracking-wider uppercase text-surface-500 dark:text-surface-400">Quest</div>
						<h2 class="mb-2 text-2xl font-bold text-surface-900 dark:text-surface-100">{data.currentQuest.title}</h2>
						<p class="text-surface-700 dark:text-surface-300">{data.currentQuest.description}</p>
					</div>

					<!-- Encounter Info -->
					<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-6">
						<div class="mb-2 text-xs tracking-wider uppercase text-surface-500 dark:text-surface-400">Encounter</div>
						<h3 class="mb-3 text-xl font-semibold text-surface-900 dark:text-surface-100">
							{data.currentEncounter.title}
						</h3>
						<p class="mb-6 text-base leading-relaxed text-surface-800 dark:text-surface-200">{data.currentEncounter.description}</p>

						<!-- Choices or Outcome -->
						{#if data.availableChoices && data.availableChoices.length > 0}
							{#if outcome && awaitingContinue}
								<!-- Outcome Display -->
								<div class="card preset-filled-secondary-500 mb-4 p-6 text-center shadow-lg">
									<p class="text-lg font-semibold">{outcome}</p>
								</div>
								<button 
									class="btn preset-filled-primary-500 w-full flex items-center justify-center gap-2" 
									onclick={handleContinue}
								>
									<span>Continue</span>
								</button>
							{:else}
								<!-- Choice Buttons -->
								<div class="flex flex-col gap-3">
									{#each data.availableChoices as choice}
										<button
											onclick={() => handleChoice(choice)}
											class="card preset-outlined-surface-200-800 hover:preset-tonal-primary p-4 text-left transition-all duration-200"
										>
											<span class="font-semibold text-surface-900 dark:text-surface-100">{choice.text}</span>
										</button>
									{/each}
								</div>
							{/if}
						{:else}
							<!-- Encounter Complete -->
							<div class="card preset-filled-secondary-500 p-4 text-center">
								<span class="font-semibold">Encounter complete!</span>
							</div>
						{/if}
					</div>
				</div>
				{:else}
					<!-- No Active Quest -->
					<div class="text-center">
						<p class="text-lg text-surface-500 dark:text-surface-400">No active quest. Your journey begins...</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Recent Activity Section -->
	<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-6">
		<h2 class="mb-4 text-2xl font-bold text-primary-500 dark:text-primary-400">Recent Activity</h2>
		<Recap />
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






