<script lang="ts">
	import Recap from '$lib/components/Recap.svelte';
	import CharacterAttributes from '$lib/components/gameplay/CharacterAttributes.svelte';
	import PlayerStoryView from '$lib/components/gameplay/PlayerStoryView.svelte';
	import CharacterStats from '$lib/components/character/CharacterStats.svelte';
	import LevelUpModal from '$lib/components/character/LevelUpModal.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import WorldIntroduction from '$lib/components/game/WorldIntroduction.svelte';
	import StoryPrologue from '$lib/components/game/StoryPrologue.svelte';
	import ArcChoice from '$lib/components/game/ArcChoice.svelte';
	import TutorialHint from '$lib/components/ui/TutorialHint.svelte';
	import { character, setCharacterAttributes } from '$lib/stores/character';
	import { tutorialStore, type TutorialHintId } from '$lib/stores/tutorial';
	import type { ChoiceFormData } from '$lib/types/ChoiceFormData.js';
	import { onMount } from 'svelte';
	import { Award } from 'lucide-svelte';

	let showCharacter = $state(false);
	let showMap = $state(false);
	let showQuests = $state(false);
	let showLog = $state(false);

	const { data } = $props();
	let outcome = $state<string | null>(null);
	let skillCheckResult = $state<any>(null);
	let awaitingContinue = $state(false);
	let isProcessingChoice = $state(false);
	
	// Tutorial state
	let tutorialState = $state($tutorialStore);
	let activeHint = $state<{ id: TutorialHintId; title: string; message: string; variant?: 'info' | 'tip' | 'warning' } | null>(null);
	
	// Subscribe to tutorial store
	$effect(() => {
		const unsubscribe = tutorialStore.subscribe((state) => {
			tutorialState = state;
		});
		return unsubscribe;
	});
	
	// Reward tracking
	let showLevelUpModal = $state(false);
	let levelUpData = $state<any>(null);
	let encounterRewards = $state<{ 
		xpGained: number; 
		goldGained: number;
		encounterXp?: number;
		encounterGold?: number;
		choiceXp?: number;
		choiceGold?: number;
	} | null>(null);
	let questRewards = $state<{ xpGained: number; goldGained: number } | null>(null);
	let currentCharacter = $state(data.character);

	async function handleChoice(choice: ChoiceFormData) {
		if (isProcessingChoice || !choice.id || !data.currentEncounter) return;
		
		isProcessingChoice = true;
		
		try {
			const res = await fetch('/api/game/make-choice', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					choiceId: choice.id, 
					encounterId: data.currentEncounter.id 
				})
			});

			if (res.ok) {
				const result = await res.json();
				
				// Update character data immediately with the new values
				if (result.character) {
					currentCharacter = result.character;
					character.set(result.character); // Also update the store
				}
				
				// Show outcome
				outcome = result.outcome ?? choice.outcome ?? 'You made a choice.';
				skillCheckResult = result.skillCheck || null;
				awaitingContinue = true;
				
				// Store rewards to display
				encounterRewards = result.rewards;
				questRewards = result.questRewards;
				
				// Update character data
				if (result.levelUp) {
					levelUpData = result.levelUp;
					// Will show modal on continue
				}
				
				// Show tutorial hints if appropriate
				showTutorialHints(result);
			} else {
				console.error('Failed to process choice');
				outcome = 'Something went wrong...';
				awaitingContinue = true;
			}
		} catch (error) {
			console.error('Error processing choice:', error);
			outcome = 'An error occurred.';
			awaitingContinue = true;
		} finally {
			isProcessingChoice = false;
		}
	}
	
	function showTutorialHints(result: any) {
		// Only show hints if tutorial is enabled
		if (!data.character.tutorial) return;
		
		// Show skill check hint on first skill check
		if (result.skillCheck && !tutorialStore.hasSeenHint('skill-check-intro', tutorialState)) {
			activeHint = {
				id: 'skill-check-intro',
				title: '🎲 Skill Checks',
				message: 'Skill checks use a d20 roll plus your attribute modifier. You need to meet or exceed the Difficulty Class (DC) to succeed. Critical successes (natural 20) always succeed!',
				variant: 'info'
			};
		}
		// Show consequences hint if there are rewards/penalties
		else if ((result.rewards || result.questRewards) && !tutorialStore.hasSeenHint('choice-consequences', tutorialState)) {
			activeHint = {
				id: 'choice-consequences',
				title: '⚖️ Choice Consequences',
				message: 'Your choices have consequences! Some grant XP, gold, or items, while others may cause you to lose resources. Choose wisely!',
				variant: 'tip'
			};
		}
		// Show level up hint
		else if (result.levelUp && !tutorialStore.hasSeenHint('level-up', tutorialState)) {
			activeHint = {
				id: 'level-up',
				title: '⬆️ Level Up!',
				message: 'Leveling up increases your max HP and grants attribute points. Spend these points wisely to enhance your character\'s abilities!',
				variant: 'tip'
			};
		}
	}
	
	function dismissHint() {
		if (activeHint) {
			tutorialStore.markHintShown(activeHint.id);
			activeHint = null;
		}
	}

	function handleContinue() {
		// Show level up modal if character leveled up
		if (levelUpData) {
			showLevelUpModal = true;
		} else {
			// Otherwise reload to get next encounter
			window.location.reload();
		}
	}

	function closeLevelUpModal() {
		showLevelUpModal = false;
		levelUpData = null;
		encounterRewards = null;
		questRewards = null;
		skillCheckResult = null;
		// Reload to show next encounter
		window.location.reload();
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
	
	// Show first encounter hint
	onMount(() => {
		if (data.character.tutorial && data.currentEncounter && !tutorialStore.hasSeenHint('first-encounter', tutorialState)) {
			activeHint = {
				id: 'first-encounter',
				title: '👋 Welcome to Your Adventure!',
				message: 'You\'ll face encounters with multiple choices. Read carefully and choose based on your character\'s strengths and your preferred playstyle.',
				variant: 'info'
			};
		}
	});

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
			currentCharacter = data.character;
		}
		if (data.attributes) {
			setCharacterAttributes(data.attributes);
		}
	});
</script>

<div class="container mx-auto max-w-7xl space-y-6 p-4 md:p-8">
	<!-- Tutorial Hint (if active) -->
	{#if activeHint}
		{@const hint = activeHint}
		<TutorialHint
			title={hint.title}
			message={hint.message}
			variant={hint.variant ?? 'info'}
			onDismiss={dismissHint}
		/>
	{/if}

	<!-- Quick Actions Bar -->
	<div class="flex flex-wrap gap-2 md:gap-4">
		<button 
			class="btn preset-tonal-surface flex items-center gap-2" 
			onclick={() => (showCharacter = true)}
		>
			<span>Character</span>
		</button>
		<a 
			href="/game/journal"
			class="btn preset-tonal-surface flex items-center gap-2"
		>
			<span>📖 Journal</span>
		</a>
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
								<div class="space-y-4">
								<!-- Skill Check Result -->
								{#if skillCheckResult}
									<div class="card p-6 {skillCheckResult.success ? 'preset-tonal-success bg-success-50 dark:bg-success-950' : 'preset-tonal-error bg-error-50 dark:bg-error-950'}">
										<div class="space-y-3">
											<!-- Title -->
											<div class="text-center">
												<div class="text-sm font-bold uppercase tracking-wide {skillCheckResult.success ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}">
													{skillCheckResult.success ? '✓ Check Passed' : '✗ Check Failed'}
												</div>
											</div>
											
											<!-- Roll Breakdown -->
											<div class="flex items-center justify-center gap-3 text-surface-900 dark:text-surface-100">
												<!-- D20 Roll -->
												<div class="text-center">
													<div class="text-3xl font-bold {skillCheckResult.criticalSuccess ? 'text-success-500' : skillCheckResult.criticalFailure ? 'text-error-500' : ''}">
														🎲 {skillCheckResult.roll}
													</div>
													<div class="text-xs text-surface-600 dark:text-surface-400">d20</div>
												</div>
												
												<!-- Plus -->
												<div class="text-2xl font-bold text-surface-500">+</div>
												
												<!-- Modifier -->
												<div class="text-center">
													<div class="text-3xl font-bold">{skillCheckResult.modifier}</div>
													<div class="text-xs text-surface-600 dark:text-surface-400">modifier</div>
												</div>
												
												<!-- Equals -->
												<div class="text-2xl font-bold text-surface-500">=</div>
												
												<!-- Total -->
												<div class="text-center">
													<div class="text-3xl font-bold {skillCheckResult.success ? 'text-success-500' : 'text-error-500'}">
														{skillCheckResult.total}
													</div>
													<div class="text-xs text-surface-600 dark:text-surface-400">total</div>
												</div>
												
												<!-- vs DC -->
												<div class="text-center">
													<div class="text-sm text-surface-600 dark:text-surface-400">vs DC</div>
													<div class="text-2xl font-bold">{skillCheckResult.dc}</div>
												</div>
											</div>
											
											<!-- Formatted Result Text -->
											<div class="text-center text-sm font-medium text-surface-700 dark:text-surface-300">
												{skillCheckResult.formattedResult}
											</div>
											
											<!-- Critical Indicator -->
											{#if skillCheckResult.criticalSuccess}
												<div class="text-center text-sm font-bold text-success-600 dark:text-success-400">
													🎯 Critical Success!
												</div>
											{:else if skillCheckResult.criticalFailure}
												<div class="text-center text-sm font-bold text-error-600 dark:text-error-400">
													💥 Critical Failure!
												</div>
											{/if}
										</div>
									</div>
								{/if}									<!-- Outcome Text -->
									<div class="card preset-filled-secondary-500 p-6 text-center shadow-lg">
										<p class="text-lg font-semibold">{outcome}</p>
									</div>

									<!-- Rewards Display -->
									{#if encounterRewards && (encounterRewards.xpGained > 0 || encounterRewards.goldGained > 0)}
										<div class="card preset-tonal-primary p-4">
											<div class="space-y-2">
												<div class="flex items-center gap-3 justify-center">
													<Award class="size-5 text-primary-500" />
													<div class="font-semibold text-surface-900 dark:text-surface-100">
														{#if encounterRewards.xpGained > 0}
															<span>+{encounterRewards.xpGained} XP</span>
														{/if}
														{#if encounterRewards.xpGained > 0 && encounterRewards.goldGained > 0}
															<span class="mx-2">•</span>
														{/if}
														{#if encounterRewards.goldGained > 0}
															<span>+{encounterRewards.goldGained} Gold</span>
														{/if}
													</div>
												</div>
												<!-- Breakdown if choice has rewards -->
												{#if (encounterRewards.choiceXp ?? 0) > 0 || (encounterRewards.choiceGold ?? 0) > 0}
													<div class="text-xs text-center text-surface-600 dark:text-surface-400">
														{#if (encounterRewards.encounterXp ?? 0) > 0}
															<span>Encounter: +{encounterRewards.encounterXp} XP</span>
															{#if (encounterRewards.encounterGold ?? 0) > 0}
																<span>, +{encounterRewards.encounterGold} Gold</span>
															{/if}
														{/if}
														{#if ((encounterRewards.encounterXp ?? 0) > 0 || (encounterRewards.encounterGold ?? 0) > 0) && ((encounterRewards.choiceXp ?? 0) > 0 || (encounterRewards.choiceGold ?? 0) > 0)}
															<span class="mx-1">•</span>
														{/if}
														{#if (encounterRewards.choiceXp ?? 0) > 0}
															<span>Choice Bonus: +{encounterRewards.choiceXp} XP</span>
															{#if (encounterRewards.choiceGold ?? 0) > 0}
																<span>, +{encounterRewards.choiceGold} Gold</span>
															{/if}
														{/if}
													</div>
												{/if}
											</div>
										</div>
									{/if}

									<!-- Quest Complete Rewards -->
									{#if questRewards && (questRewards.xpGained > 0 || questRewards.goldGained > 0)}
										<div class="card preset-tonal-success p-4">
											<div class="text-center space-y-2">
												<div class="text-sm font-bold uppercase tracking-wide text-success-600 dark:text-success-400">
													Quest Complete!
												</div>
												<div class="font-semibold text-surface-900 dark:text-surface-100">
													{#if questRewards.xpGained > 0}
														<span>+{questRewards.xpGained} XP</span>
													{/if}
													{#if questRewards.xpGained > 0 && questRewards.goldGained > 0}
														<span class="mx-2">•</span>
													{/if}
													{#if questRewards.goldGained > 0}
														<span>+{questRewards.goldGained} Gold</span>
													{/if}
												</div>
											</div>
										</div>
									{/if}
									
									<button 
										class="btn preset-filled-primary-500 w-full flex items-center justify-center gap-2" 
										onclick={handleContinue}
										disabled={isProcessingChoice}
									>
										<span>Continue</span>
									</button>
								</div>
							{:else}
								<!-- Choice Buttons -->
								<div class="flex flex-col gap-3">
									{#each data.availableChoices as choice}
										<button
											onclick={() => handleChoice(choice)}
											disabled={isProcessingChoice}
											class="card preset-outlined-surface-200-800 hover:preset-tonal-primary p-4 text-left transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

<LevelUpModal open={showLevelUpModal} {levelUpData} onClose={closeLevelUpModal} />






