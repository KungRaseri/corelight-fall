<script lang="ts">
	import CharacterStats from '$lib/components/character/CharacterStats.svelte';
	import LevelUpModal from '$lib/components/character/LevelUpModal.svelte';
	import { Award, Swords, ScrollText } from 'lucide-svelte';
	import { awardRewards } from '$lib/utils/rewards';

	let { data } = $props();
	
	let character = $state(data.character);
	let showLevelUpModal = $state(false);
	let levelUpData = $state<any>(null);
	let isAwarding = $state(false);

	async function grantReward(xp: number, gold: number, source: string) {
		if (isAwarding) return;
		
		isAwarding = true;
		const result = await awardRewards({ xpGained: xp, goldGained: gold, source });
		
		if (result.success && result.character) {
			character = result.character;
			
			if (result.levelUp) {
				levelUpData = result.levelUp;
				showLevelUpModal = true;
			}
		}
		
		isAwarding = false;
	}

	function closeLevelUpModal() {
		showLevelUpModal = false;
		levelUpData = null;
	}
</script>

<div class="container mx-auto p-4 space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold">Character Progression Test</h1>
	</div>

	{#if character}
		<CharacterStats {character} />

		<!-- Test Reward Buttons -->
		<div class="card preset-tonal-surface p-6 space-y-4">
			<h2 class="text-xl font-bold">Award Rewards</h2>
			<p class="text-sm text-surface-600 dark:text-surface-400">
				Test the XP and leveling system by awarding different amounts of rewards
			</p>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<!-- Small Encounter -->
				<button
					onclick={() => grantReward(50, 25, 'Test: Small Encounter')}
					disabled={isAwarding}
					class="card preset-outlined-primary hover:preset-tonal-primary p-4 space-y-2 transition-all duration-200"
				>
					<div class="flex items-center gap-2">
						<Swords class="size-5 text-primary-500" />
						<h3 class="font-bold">Small Encounter</h3>
					</div>
					<p class="text-sm text-surface-600 dark:text-surface-400">
						+50 XP, +25 Gold
					</p>
				</button>

				<!-- Medium Quest -->
				<button
					onclick={() => grantReward(200, 100, 'Test: Medium Quest')}
					disabled={isAwarding}
					class="card preset-outlined-secondary hover:preset-tonal-secondary p-4 space-y-2 transition-all duration-200"
				>
					<div class="flex items-center gap-2">
						<ScrollText class="size-5 text-secondary-500" />
						<h3 class="font-bold">Medium Quest</h3>
					</div>
					<p class="text-sm text-surface-600 dark:text-surface-400">
						+200 XP, +100 Gold
					</p>
				</button>

				<!-- Large Storyline -->
				<button
					onclick={() => grantReward(500, 300, 'Test: Large Storyline')}
					disabled={isAwarding}
					class="card preset-outlined-tertiary hover:preset-tonal-tertiary p-4 space-y-2 transition-all duration-200"
				>
					<div class="flex items-center gap-2">
						<Award class="size-5 text-tertiary-500" />
						<h3 class="font-bold">Large Storyline</h3>
					</div>
					<p class="text-sm text-surface-600 dark:text-surface-400">
						+500 XP, +300 Gold
					</p>
				</button>
			</div>
		</div>
	{:else}
		<div class="card preset-tonal-surface p-8 text-center">
			<p>No character found. Please create a character first.</p>
		</div>
	{/if}
</div>

<LevelUpModal bind:open={showLevelUpModal} {levelUpData} onClose={closeLevelUpModal} />
