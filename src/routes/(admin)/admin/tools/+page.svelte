<script lang="ts">
	import { PackagePlus, CheckCircle2, XCircle, Loader2 } from 'lucide-svelte';

	let isSeeding = $state(false);
	let result = $state<{ success: boolean; message: string; itemCount?: number } | null>(null);

	async function seedItems() {
		isSeeding = true;
		result = null;

		try {
			const response = await fetch('/api/admin/seed-items', {
				method: 'POST'
			});

			const data = await response.json();
			result = data;
		} catch (error) {
			result = {
				success: false,
				message: error instanceof Error ? error.message : 'Failed to seed items'
			};
		} finally {
			isSeeding = false;
		}
	}
</script>

<div class="container mx-auto max-w-4xl space-y-8 p-6">
	<div class="space-y-2">
		<h1 class="text-4xl font-bold text-primary-500 dark:text-primary-400">Admin Tools</h1>
		<p class="text-surface-700 dark:text-surface-300">
			Manage game content, seed data, and perform administrative tasks
		</p>
	</div>

	<!-- Item Seeding Section -->
	<div class="card preset-outlined-surface-200-800 bg-surface-50 dark:bg-surface-900 p-6 space-y-4">
		<div class="flex items-center gap-3">
			<div class="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
				<PackagePlus class="size-6 text-primary-500" />
			</div>
			<div>
				<h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100">Seed Game Items</h2>
				<p class="text-sm text-surface-600 dark:text-surface-400">
					Add all enhanced items to the database (weapons, armor, accessories, relics)
				</p>
			</div>
		</div>

		<div class="space-y-4">
			<div class="rounded-lg bg-surface-100 dark:bg-surface-800 p-4">
				<h3 class="mb-2 font-semibold text-surface-900 dark:text-surface-100">What will be added:</h3>
				<ul class="space-y-1 text-sm text-surface-700 dark:text-surface-300">
					<li>• 15 Weapons (starter to legendary)</li>
					<li>• 15 Armor pieces (3 complete sets)</li>
					<li>• 10 Accessories (amulets, rings, trinkets)</li>
					<li>• 5 Relics (special divine items)</li>
					<li>• 5 Consumables (healing, buffs)</li>
					<li>• 4 Quest items</li>
					<li class="pt-2 font-semibold">Total: ~54 new items</li>
				</ul>
			</div>

			<button
				class="btn preset-filled-primary-500 w-full flex items-center justify-center gap-2"
				onclick={seedItems}
				disabled={isSeeding}
			>
				{#if isSeeding}
					<Loader2 class="size-5 animate-spin" />
					<span>Seeding Items...</span>
				{:else}
					<PackagePlus class="size-5" />
					<span>Seed Items</span>
				{/if}
			</button>

			{#if result}
				<div
					class="card p-4 {result.success
						? 'preset-tonal-success bg-success-50 dark:bg-success-950'
						: 'preset-tonal-error bg-error-50 dark:bg-error-950'}"
				>
					<div class="flex items-start gap-3">
						{#if result.success}
							<CheckCircle2 class="size-5 text-success-500 shrink-0 mt-0.5" />
						{:else}
							<XCircle class="size-5 text-error-500 shrink-0 mt-0.5" />
						{/if}
						<div class="flex-1">
							<p class="font-semibold {result.success ? 'text-success-700 dark:text-success-300' : 'text-error-700 dark:text-error-300'}">
								{result.success ? 'Success!' : 'Error'}
							</p>
							<p class="text-sm {result.success ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}">
								{result.message}
							</p>
							{#if result.itemCount}
								<p class="mt-1 text-xs {result.success ? 'text-success-500' : 'text-error-500'}">
									{result.itemCount} items processed
								</p>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Future Admin Tools -->
	<div class="card preset-outlined-surface-200-800 bg-surface-50 dark:bg-surface-900 p-6 space-y-4">
		<h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100">Coming Soon</h2>
		<div class="grid gap-3 md:grid-cols-2">
			<div class="rounded-lg bg-surface-100 dark:bg-surface-800 p-4 opacity-50">
				<h3 class="font-semibold text-surface-900 dark:text-surface-100">Seed Storylines</h3>
				<p class="text-sm text-surface-600 dark:text-surface-400">
					Add new quests and encounters
				</p>
			</div>
			<div class="rounded-lg bg-surface-100 dark:bg-surface-800 p-4 opacity-50">
				<h3 class="font-semibold text-surface-900 dark:text-surface-100">Manage Characters</h3>
				<p class="text-sm text-surface-600 dark:text-surface-400">
					View and edit player characters
				</p>
			</div>
			<div class="rounded-lg bg-surface-100 dark:bg-surface-800 p-4 opacity-50">
				<h3 class="font-semibold text-surface-900 dark:text-surface-100">Game Balance</h3>
				<p class="text-sm text-surface-600 dark:text-surface-400">
					Adjust rewards, difficulty, progression
				</p>
			</div>
			<div class="rounded-lg bg-surface-100 dark:bg-surface-800 p-4 opacity-50">
				<h3 class="font-semibold text-surface-900 dark:text-surface-100">Analytics</h3>
				<p class="text-sm text-surface-600 dark:text-surface-400">
					View player statistics and trends
				</p>
			</div>
		</div>
	</div>
</div>
