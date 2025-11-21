<script lang="ts">
	import { character as characterStore } from '$lib/stores/character';

	interface Props {
		character: any;
	}

	let { character: initialCharacter }: Props = $props();

	// Subscribe to store for reactive updates
	let currentCharacter = $state($characterStore || initialCharacter);
	
	$effect(() => {
		const unsubscribe = characterStore.subscribe((value) => {
			if (value) {
				currentCharacter = value;
			}
		});
		return unsubscribe;
	});
</script>

<header class="w-full border-b border-surface-300 dark:border-surface-700 bg-surface-100 dark:bg-surface-900 px-4 md:px-6 py-4 shadow-sm">
	{#if currentCharacter}
		<div class="container mx-auto flex flex-wrap items-center justify-between gap-4">
			<div class="flex items-center gap-6">
				<h1 class="text-xl md:text-2xl font-bold text-primary-500 dark:text-primary-400">{currentCharacter.name}</h1>
				<div class="hidden md:flex items-center gap-4 text-sm">
					<span class="text-surface-700 dark:text-surface-300">Level {currentCharacter.level ?? 1}</span>
					<span class="text-surface-700 dark:text-surface-300">XP: {currentCharacter.xp ?? 0}</span>
				</div>
			</div>
			<div class="flex items-center gap-4 text-sm md:text-base">
				<span class="text-surface-700 dark:text-surface-300">HP: {currentCharacter.hp ?? 100}%</span>
				<span class="text-surface-700 dark:text-surface-300">Gold: {currentCharacter.gold ?? 0}</span>
			</div>
		</div>
	{:else}
		<div class="container mx-auto">
			<h1 class="text-2xl md:text-3xl font-bold text-primary-500 dark:text-primary-400">The Corelight Fall</h1>
		</div>
	{/if}
</header>






