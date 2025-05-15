<script lang="ts">
	export let attributes: Array<{ name: string; description: string; baseValue: number }>;
	export let allocation: Record<string, number>;
	export let setAllocation: (name: string, value: number) => void;
	export let pointsLeft: number;
</script>

<div class="card bg-surface-100-900 mx-auto max-w-2xl space-y-4 p-10 text-left">
	<h2 class="h3 mb-4">Attributes</h2>
	<p>You have <b>{pointsLeft}</b> points to distribute among your attributes.</p>
	{#each attributes as attr}
		<div class="mb-2 flex items-center gap-4">
			<label class="w-32 font-bold" for={attr.name}>{attr.name}</label>
			<span class="flex-1 text-left text-sm text-gray-500">{attr.description}</span>
			<input
				type="number"
				min={attr.baseValue}
				max={Math.min(15, allocation[attr.name] + pointsLeft)}
				name={attr.name}
				value={allocation[attr.name]}
				on:input={(e) => {
					let val = +e.target.value;
					if (val > 15) val = 15;
					if (val < attr.baseValue) val = attr.baseValue;
					setAllocation(attr.name, val);
				}}
				class="input w-16"
			/>
		</div>
	{/each}
</div>
