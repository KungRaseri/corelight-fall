<script lang="ts">
	interface Props {
		attributes: Array<{ name: string; description: string; baseValue: number }>;
		allocation: Record<string, number>;
		setAllocation: (name: string, value: number) => void;
		pointsLeft: number;
	}

	let { attributes, allocation, setAllocation, pointsLeft }: Props = $props();
</script>

<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 mx-auto max-w-3xl space-y-6 p-8">
	<div class="space-y-2">
		<h2 class="text-2xl font-bold text-primary-500 dark:text-primary-400">Distribute Attributes</h2>
		<p class="text-surface-700 dark:text-surface-300 text-sm">
			Allocate your starting points to customize your character's strengths.
		</p>
	</div>

	<div class="card preset-filled-primary flex items-center justify-between p-4">
		<span class="font-semibold text-primary-contrast-500">Points Remaining</span>
		<span class="text-2xl font-bold text-primary-contrast-500">{pointsLeft}</span>
	</div>

	<div class="space-y-4">
		{#each attributes as attr}
			<div class="card preset-outlined-surface-200-800 bg-surface-100 dark:bg-surface-800 p-4">
				<div class="mb-2 flex items-center justify-between">
					<label class="font-bold text-surface-900 dark:text-surface-100" for={attr.name}>
						{attr.name}
					</label>
					<div class="flex items-center gap-2">
						<button
							type="button"
							class="btn-icon btn-icon-sm preset-tonal-surface"
							onclick={() => setAllocation(attr.name, (allocation[attr.name] ?? attr.baseValue) - 1)}
							disabled={(allocation[attr.name] ?? attr.baseValue) <= attr.baseValue}
							aria-label={`Decrease ${attr.name}`}
						>
							-
						</button>
						<input
							type="number"
							min={attr.baseValue}
							max={15}
							name={attr.name}
							value={allocation[attr.name] ?? attr.baseValue}
							oninput={(e) => {
								const target = e.target as HTMLInputElement;
								let val = +target.value;
								if (val > 15) val = 15;
								if (val < attr.baseValue) val = attr.baseValue;
								setAllocation(attr.name, val);
							}}
							class="input preset-glass-surface w-16 text-center"
							aria-label={`${attr.name} value`}
						/>
						<button
							type="button"
							class="btn-icon btn-icon-sm preset-tonal-surface"
							onclick={() => setAllocation(attr.name, (allocation[attr.name] ?? attr.baseValue) + 1)}
							disabled={(allocation[attr.name] ?? attr.baseValue) >= 15 || pointsLeft <= 0}
							aria-label={`Increase ${attr.name}`}
						>
							+
						</button>
					</div>
				</div>
				<p class="text-surface-600 dark:text-surface-400 text-sm">{attr.description}</p>
			</div>
		{/each}
	</div>

	{#if pointsLeft !== 0}
		<div class="card preset-filled-warning p-3 text-center">
			<p class="text-warning-contrast-500 text-sm font-semibold">
				You must allocate all points before continuing
			</p>
		</div>
	{/if}
</div>






