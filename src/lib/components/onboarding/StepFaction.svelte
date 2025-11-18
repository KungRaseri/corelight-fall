<script lang="ts">
	interface Props {
		factions: Array<{ name: string; description: string }>;
		factionValue: string;
		setFaction: (v: string) => void;
	}

	let { factions, factionValue, setFaction }: Props = $props();
</script>

<div class="card bg-surface-100 dark:bg-surface-900 mx-auto max-w-md space-y-4 p-10 text-left">
	<h2 class="h3 mb-4">Faction</h2>
	<span class="font-semibold">Choose your faction:</span>
	{#each factions as faction}
		<label class="block">
			<input
				type="radio"
				checked={factionValue === faction.name}
				onchange={() => setFaction(faction.name)}
				required
			/>
			{faction.name} — {faction.description}
		</label>
	{/each}
</div>
