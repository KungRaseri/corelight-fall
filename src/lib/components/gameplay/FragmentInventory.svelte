<script lang="ts">
	import { onMount } from 'svelte';
	
	interface FragmentAbility {
		id: string;
		name: string;
		description: string;
		type: 'active' | 'passive';
		cooldown?: number;
	}
	
	interface Fragment {
		id: number;
		name: string;
		type: string;
		tier: number;
		description: string;
		loreText: string | null;
		powerLevel: number;
		corruptionLevel: number;
		abilities: FragmentAbility[];
		attunementLevel: number | null;
		maxAttunementLevel: number;
		totalUseCount: number;
		glowColor: string | null;
	}
	
	let fragments = $state<Fragment[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let selectedFragment = $state<Fragment | null>(null);
	
	onMount(async () => {
		await loadFragments();
	});
	
	async function loadFragments() {
		try {
			loading = true;
			const response = await fetch('/api/fragments');
			
			if (!response.ok) {
				throw new Error('Failed to load fragments');
			}
			
			fragments = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown error';
			console.error('Error loading fragments:', err);
		} finally {
			loading = false;
		}
	}
	
	function getAttunementPercentage(fragment: Fragment): number {
		if (!fragment.attunementLevel) return 0;
		return Math.round((fragment.attunementLevel / fragment.maxAttunementLevel) * 100);
	}
	
	function getTierColor(tier: number): string {
		if (tier >= 5) return 'text-error-500';
		if (tier >= 4) return 'text-warning-500';
		if (tier >= 3) return 'text-primary-500';
		if (tier >= 2) return 'text-success-500';
		return 'text-surface-500';
	}
	
	function getCorruptionColor(level: number): string {
		if (level >= 75) return 'bg-error-500';
		if (level >= 50) return 'bg-warning-500';
		if (level >= 25) return 'bg-primary-500';
		return 'bg-success-500';
	}
	
	function formatAbilityType(type: string): string {
		return type.charAt(0).toUpperCase() + type.slice(1);
	}
</script>

<div class="w-full space-y-4">
	<!-- Header -->
	<h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100">Fragment Collection</h2>

	<!-- Loading State -->
	{#if loading}
		<div class="card preset-tonal-surface p-8 text-center">
			<p class="text-surface-600 dark:text-surface-400">Loading fragments...</p>
		</div>
	{/if}

	<!-- Error State -->
	{#if error}
		<div class="card preset-filled-error-500 p-4">
			<p class="text-error-contrast-500">Error: {error}</p>
			<button class="btn preset-tonal mt-2" onclick={loadFragments}>
				Try Again
			</button>
		</div>
	{/if}

	<!-- Fragment Grid -->
	{#if !loading && !error}
		{#if fragments.length === 0}
			<div class="card preset-tonal-surface p-8 text-center">
				<p class="text-surface-600 dark:text-surface-400">
					You haven't discovered any fragments yet. Explore the ruins to find ancient Corelight shards!
				</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each fragments as fragment (fragment.id)}
					<button
						class="card preset-outlined-surface-200-800 bg-surface-50 dark:bg-surface-950 p-4 space-y-3 text-left transition-all hover:scale-105"
						onclick={() => selectedFragment = fragment}
					>
						<!-- Fragment Header -->
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<h3 class="text-lg font-bold text-surface-900 dark:text-surface-100">
									{fragment.name}
								</h3>
								<div class="flex items-center gap-2 mt-1">
									<span class="badge preset-tonal-surface text-xs">
										{fragment.type}
									</span>
									<span class="badge preset-tonal text-xs {getTierColor(fragment.tier)}">
										Tier {fragment.tier}
									</span>
								</div>
							</div>
							{#if fragment.glowColor}
								<div 
									class="w-8 h-8 rounded-full"
									style="background-color: {fragment.glowColor}; box-shadow: 0 0 12px {fragment.glowColor};"
								></div>
							{/if}
						</div>

						<!-- Fragment Description -->
						<p class="text-sm text-surface-700 dark:text-surface-300 line-clamp-2">
							{fragment.description}
						</p>

						<!-- Power & Corruption -->
						<div class="grid grid-cols-2 gap-2 text-xs">
							<div>
								<span class="text-surface-600 dark:text-surface-400">Power:</span>
								<span class="font-semibold text-primary-500 ml-1">{fragment.powerLevel}</span>
							</div>
							<div>
								<span class="text-surface-600 dark:text-surface-400">Corruption:</span>
								<span class="font-semibold text-error-500 ml-1">{fragment.corruptionLevel}%</span>
							</div>
						</div>

						<!-- Attunement Progress -->
						{#if fragment.attunementLevel !== null}
							<div class="space-y-1">
								<div class="flex items-center justify-between text-xs">
									<span class="text-surface-600 dark:text-surface-400">Attunement</span>
									<span class="font-semibold text-surface-900 dark:text-surface-100">
										{getAttunementPercentage(fragment)}%
									</span>
								</div>
								<div class="w-full bg-surface-200 dark:bg-surface-800 rounded-full h-1.5">
									<div
										class="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
										style="width: {getAttunementPercentage(fragment)}%"
									></div>
								</div>
							</div>
						{/if}

						<!-- Abilities Count -->
						<div class="text-xs text-surface-600 dark:text-surface-400">
							{fragment.abilities.length} abilit{fragment.abilities.length !== 1 ? 'ies' : 'y'} • 
							Used {fragment.totalUseCount} time{fragment.totalUseCount !== 1 ? 's' : ''}
						</div>
					</button>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<!-- Fragment Detail Modal -->
{#if selectedFragment}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div 
		class="fixed inset-0 z-50 bg-surface-950/50 backdrop-blur-sm flex items-center justify-center p-4"
		onclick={() => selectedFragment = null}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div 
			class="card preset-outlined-surface-200-800 bg-surface-50 dark:bg-surface-950 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4"
			onclick={(e) => e.stopPropagation()}
		>
			<!-- Modal Header -->
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<h3 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
						{selectedFragment.name}
					</h3>
					<div class="flex items-center gap-2">
						<span class="badge preset-tonal-surface">
							{selectedFragment.type}
						</span>
						<span class="badge preset-tonal {getTierColor(selectedFragment.tier)}">
							Tier {selectedFragment.tier}
						</span>
					</div>
				</div>
				<button 
					class="btn-icon hover:preset-tonal"
					onclick={() => selectedFragment = null}
				>
					<span class="text-xl">×</span>
				</button>
			</div>

			<!-- Description -->
			<div class="space-y-2">
				<p class="text-surface-700 dark:text-surface-300">
					{selectedFragment.description}
				</p>
				{#if selectedFragment.loreText}
					<div class="p-3 bg-surface-100 dark:bg-surface-900 rounded-lg border-l-4 border-primary-500">
						<p class="text-sm italic text-surface-600 dark:text-surface-400">
							{selectedFragment.loreText}
						</p>
					</div>
				{/if}
			</div>

			<!-- Stats Grid -->
			<div class="grid grid-cols-2 gap-4">
				<div class="card preset-tonal-surface p-3">
					<div class="text-sm text-surface-600 dark:text-surface-400">Power Level</div>
					<div class="text-2xl font-bold text-primary-500">{selectedFragment.powerLevel}</div>
				</div>
				<div class="card preset-tonal-surface p-3">
					<div class="text-sm text-surface-600 dark:text-surface-400">Corruption</div>
					<div class="text-2xl font-bold text-error-500">{selectedFragment.corruptionLevel}%</div>
				</div>
			</div>

			<!-- Corruption Bar -->
			<div class="space-y-1">
				<div class="text-sm text-surface-600 dark:text-surface-400">Corruption Level</div>
				<div class="w-full bg-surface-200 dark:bg-surface-800 rounded-full h-2">
					<div
						class="{getCorruptionColor(selectedFragment.corruptionLevel)} h-2 rounded-full transition-all duration-300"
						style="width: {selectedFragment.corruptionLevel}%"
					></div>
				</div>
			</div>

			<!-- Attunement -->
			{#if selectedFragment.attunementLevel !== null}
				<div class="space-y-2">
					<div class="text-sm text-surface-600 dark:text-surface-400">Attunement Progress</div>
					<div class="w-full bg-surface-200 dark:bg-surface-800 rounded-full h-3">
						<div
							class="bg-primary-500 h-3 rounded-full transition-all duration-300 flex items-center justify-center"
							style="width: {getAttunementPercentage(selectedFragment)}%"
						>
							<span class="text-xs font-bold text-primary-contrast-500">
								{getAttunementPercentage(selectedFragment)}%
							</span>
						</div>
					</div>
					<div class="text-xs text-surface-500">
						{selectedFragment.attunementLevel}/{selectedFragment.maxAttunementLevel}
					</div>
				</div>
			{/if}

			<!-- Abilities -->
			{#if selectedFragment.abilities.length > 0}
				<div class="space-y-3">
					<h4 class="text-lg font-semibold text-surface-900 dark:text-surface-100">Abilities</h4>
					<div class="space-y-2">
						{#each selectedFragment.abilities as ability}
							<div class="card preset-tonal-surface p-3 space-y-1">
								<div class="flex items-center justify-between">
									<h5 class="font-semibold text-surface-900 dark:text-surface-100">
										{ability.name}
									</h5>
									<div class="flex items-center gap-2">
										<span class="badge preset-tonal text-xs">
											{formatAbilityType(ability.type)}
										</span>
										{#if ability.cooldown}
											<span class="badge preset-tonal-surface text-xs">
												{ability.cooldown}s cooldown
											</span>
										{/if}
									</div>
								</div>
								<p class="text-sm text-surface-700 dark:text-surface-300">
									{ability.description}
								</p>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Usage Stats -->
			<div class="text-sm text-surface-600 dark:text-surface-400 border-t border-surface-300 dark:border-surface-700 pt-3">
				Used {selectedFragment.totalUseCount} time{selectedFragment.totalUseCount !== 1 ? 's' : ''} in total
			</div>
		</div>
	</div>
{/if}
