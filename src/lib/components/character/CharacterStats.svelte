<script lang="ts">
	import { Heart, Zap, Coins, TrendingUp } from 'lucide-svelte';
	import { getXpProgress, formatXp, LEVELING_CONFIG } from '$lib/utils/leveling';

	interface Props {
		character: {
			name: string;
			level: number;
			xp: number;
			hp: number;
			maxHp: number;
			gold: number;
		};
		showDetails?: boolean;
	}

	let { character, showDetails = true }: Props = $props();

	let xpProgress = $derived(getXpProgress(character.xp, character.level));
	let xpFormatted = $derived(formatXp(character.xp, character.level));
	let hpPercentage = $derived((character.hp / character.maxHp) * 100);
	let isMaxLevel = $derived(character.level >= LEVELING_CONFIG.MAX_LEVEL);
</script>

<div class="card preset-tonal-surface p-4 space-y-4">
	<!-- Character Header -->
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold">{character.name}</h2>
			<p class="text-sm text-surface-600 dark:text-surface-400">
				Level {character.level}
				{#if isMaxLevel}
					<span class="badge preset-filled-primary text-xs ml-2">MAX</span>
				{/if}
			</p>
		</div>
		<div class="flex items-center gap-3">
			<div class="flex items-center gap-1 text-warning-500">
				<Coins class="size-5" />
				<span class="font-bold">{character.gold.toLocaleString()}</span>
			</div>
		</div>
	</div>

	{#if showDetails}
		<!-- Health Bar -->
		<div class="space-y-1">
			<div class="flex items-center justify-between text-sm">
				<div class="flex items-center gap-2">
					<Heart class="size-4 text-error-500" />
					<span class="font-medium">Health</span>
				</div>
				<span class="font-mono">
					{character.hp} / {character.maxHp}
				</span>
			</div>
			<div class="h-2 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
				<div
					class="h-full bg-gradient-to-r from-error-500 to-error-400 transition-all duration-300"
					style="width: {hpPercentage}%"
				></div>
			</div>
		</div>

		<!-- XP Bar -->
		{#if !isMaxLevel}
			<div class="space-y-1">
				<div class="flex items-center justify-between text-sm">
					<div class="flex items-center gap-2">
						<TrendingUp class="size-4 text-primary-500" />
						<span class="font-medium">Experience</span>
					</div>
					<span class="font-mono text-xs">{xpFormatted}</span>
				</div>
				<div class="h-2 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
					<div
						class="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300"
						style="width: {xpProgress * 100}%"
					></div>
				</div>
			</div>
		{:else}
			<div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
				<Zap class="size-4" />
				<span>Maximum level reached!</span>
			</div>
		{/if}
	{/if}
</div>
