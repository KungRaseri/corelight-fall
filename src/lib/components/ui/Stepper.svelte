<script lang="ts">
	import IconArrowLeft from 'lucide-svelte/icons/arrow-left';
	import IconArrowRight from 'lucide-svelte/icons/arrow-right';

	const { steps } = $props();

	let currentStep = $state(0);
	const isFirstStep = $derived(currentStep === 0);
	const isLastStep = $derived(currentStep === steps.length - 1);

	function isCurrentStep(index: number) {
		return currentStep === index;
	}
	function setStep(index: number) {
		currentStep = index;
	}
	function prevStep() {
		if (currentStep > 0) currentStep--;
	}
	function nextStep() {
		if (currentStep < steps.length - 1) currentStep++;
	}
</script>

<div class="w-full">
	<!-- Timeline -->
	<div class="relative mb-8">
		<div class="flex items-center justify-between gap-4">
			{#each steps as step, i}
				<button
					class="btn-icon btn-icon rounded-full {isCurrentStep(i)
						? 'preset-filled-primary'
						: 'preset-filled-surface'}"
					onclick={() => setStep(i)}
					title={step.label}
					type="button"
				>
					<span class="font-bold">{i + 1}</span>
				</button>
			{/each}
		</div>
		<hr class="hr !border-surface-200 dark:border-surface-800 absolute top-[50%] right-0 left-0 z-[-1]" />
	</div>

	<!-- Step Content -->
	{#if steps[currentStep]}
		{@const StepComponent = steps[currentStep].component}
		<StepComponent />
	{/if}

	<!-- Navigation -->
	<nav class="mt-8 flex items-center justify-between gap-4">
		<button
			type="button"
			class="btn preset-tonal hover:preset-filled"
			onclick={prevStep}
			disabled={isFirstStep}
		>
			<IconArrowLeft size={18} />
			<span>Previous</span>
		</button>
		<button
			type="button"
			class="btn preset-tonal hover:preset-filled"
			onclick={nextStep}
			disabled={isLastStep}
		>
			<span>Next</span>
			<IconArrowRight size={18} />
		</button>
	</nav>
</div>






