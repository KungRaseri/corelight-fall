<script lang="ts">
	export let factions: Array<{ name: string; description: string }>;
	export let factionValue: string;
	export let setFaction: (v: string) => void;
</script>

<div class="card bg-surface-100-900 mx-auto max-w-md space-y-4 p-10 text-left">
	<h2 class="h3 mb-4">Faction</h2>
	<span class="font-semibold">Choose your faction:</span>
	{#each factions as faction}
		<label class="block">
			<input
				type="radio"
				checked={factionValue === faction.name}
				on:change={() => setFaction(faction.name)}
				required
			/>
			{faction.name} — {faction.description}
		</label>
	{/each}
</div>
