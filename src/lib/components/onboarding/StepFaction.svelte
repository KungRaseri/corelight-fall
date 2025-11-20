<script lang="ts">
	interface Props {
		factions: Array<{ name: string; description: string }>;
		factionValue: string;
		setFaction: (v: string) => void;
	}

	let { factions, factionValue, setFaction }: Props = $props();
</script>

<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 mx-auto max-w-2xl space-y-6 p-8">
	<div class="space-y-2">
		<h2 class="text-2xl font-bold text-primary-500 dark:text-primary-400">Choose Your Faction</h2>
		<p class="text-surface-700 dark:text-surface-300 text-sm">
			Align yourself with one of the world's major factions. Your choice will shape your journey.
		</p>
	</div>

	<div class="space-y-3">
		{#each factions as faction}
			<label class="card preset-outlined-surface-200-800 bg-surface-100 dark:bg-surface-800 hover:preset-tonal-primary block cursor-pointer p-4 transition-all duration-200">
				<div class="flex items-start gap-3">
					<input
						type="radio"
						name="faction"
						checked={factionValue === faction.name}
						onchange={() => setFaction(faction.name)}
						required
						class="mt-1"
						aria-label={`Select ${faction.name}`}
					/>
					<div class="flex-1">
						<div class="font-bold text-surface-900 dark:text-surface-100">{faction.name}</div>
						<div class="text-surface-600 dark:text-surface-400 mt-1 text-sm">{faction.description}</div>
					</div>
				</div>
			</label>
		{/each}
	</div>
</div>






