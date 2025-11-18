<script lang="ts">
	const {
		speaker = '',
		text = '',
		portrait = null,
		choices = [],
		onChoice = () => {}
	} = $props<{
		speaker?: string;
		text?: string;
		portrait?: string | null;
		choices?: { label: string; value: string }[];
		onChoice?: (value: string) => void;
	}>();

	let displayed = $state('');
	let index = $state(0);

	// Typewriter effect
	$effect(() => {
		if (text) {
			displayed = '';
			index = 0;
			const interval = setInterval(() => {
				if (index < text.length) {
					displayed += text[index];
					index++;
				} else {
					clearInterval(interval);
				}
			}, 18);
			return () => clearInterval(interval);
		}
	});
</script>

<div
	class="dialog-box bg-surface-900 border-primary-700 mx-auto flex max-w-xl items-start gap-4 rounded-lg border-2 p-6 shadow-xl"
>
	{#if portrait}
		<img
			src={portrait}
			alt={speaker}
			class="border-primary-400 h-16 w-16 rounded-full border-2 object-cover"
		/>
	{/if}
	<div class="flex-1">
		{#if speaker}
			<div class="text-primary-300 mb-1 font-bold">{speaker}</div>
		{/if}
		<div class="min-h-[3em] text-lg text-gray-100">{displayed}</div>
		{#if displayed === text && choices.length > 0}
			<div class="mt-4 flex flex-col gap-2">
				{#each choices as choice}
					<button class="btn preset-tonal w-full" onclick={() => onChoice(choice.value)}>
						{choice.label}
					</button>
				{/each}
			</div>
		{:else if displayed === text}
			<button class="btn mt-4" onclick={() => onChoice('next')}>Continue</button>
		{/if}
	</div>
</div>

<style>
	.dialog-box {
		backdrop-filter: blur(2px);
	}
</style>






