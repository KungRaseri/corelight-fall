<script lang="ts">
	interface Props {
		attributes: Array<{ name: string; description: string; baseValue: number }>;
		allocation: Record<string, number>;
		setAllocation: (name: string, value: number) => void;
		pointsLeft: number;
	}

	let { attributes, allocation, setAllocation, pointsLeft }: Props = $props();
</script>

<div class="card bg-surface-100 dark:bg-surface-900 mx-auto max-w-2xl space-y-4 p-10 text-left">
	<h2 class="h3 mb-4">Attributes</h2>
	<p>You have <b>{pointsLeft}</b> points to distribute among your attributes.</p>
	{#each attributes as attr}
		<div class="mb-2 flex items-center gap-4">
			<label class="w-32 font-bold" for={attr.name}>{attr.name}</label>
			<span class="flex-1 text-left text-sm text-surface-500 dark:text-surface-400">{attr.description}</span>
			<input
				type="number"
				min={attr.baseValue}
				max={Math.min(15, allocation[attr.name] + pointsLeft)}
				name={attr.name}
				value={allocation[attr.name] ?? attr.baseValue}
				oninput={(e) => {
					const target = e.target as HTMLInputElement;
					let val = +target.value;
					if (val > 15) val = 15;
					if (val < attr.baseValue) val = attr.baseValue;
					setAllocation(attr.name, val);
				}}
				class="input w-16"
			/>
		</div>
	{/each}
</div>






