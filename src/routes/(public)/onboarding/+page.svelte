<script lang="ts">
	import IconArrowLeft from 'lucide-svelte/icons/arrow-left';
	import IconArrowRight from 'lucide-svelte/icons/arrow-right';
	import IconCheck from 'lucide-svelte/icons/check';
	import StepCharacter from '$lib/components/onboarding/StepCharacter.svelte';
	import StepFaction from '$lib/components/onboarding/StepFaction.svelte';
	import StepAttributes from '$lib/components/onboarding/StepAttributes.svelte';
	import { onboardingData } from '$lib/stores/onboarding';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const { data } = $props();

	const steps = [
		{
			label: 'Introduction',
			description:
				'Welcome to The Corelight Fall! Your journey begins as the world lies in ruins...'
		},
		{ label: 'Character', description: 'Choose your name and appearance.' },
		{ label: 'Faction', description: 'Select your allegiance.' },
		{ label: 'Attributes', description: 'Distribute your starting attributes.' },
		{ label: 'Finalize', description: 'Review your choices before entering the world.' },
		{ label: 'Tutorial', description: 'Would you like to start with a guided tutorial?' }
	];

	let currentStep = $state(0);

	let name = $state('');
	let appearance = $state('');
	let factionValue = $state('');
	let allocation = $state<Record<string, number>>({});
	let tutorial = $state(false);

	let totalPoints = 10;

	// Initialize local state from the store or existing character data
	onMount(() => {
		const current = get(onboardingData);
		
		// If there's existing character data (from reset), use that as defaults
		if (data.existingCharacter) {
			name = data.existingCharacter.name ?? '';
			appearance = data.existingCharacter.appearance ?? '';
			factionValue = data.existingCharacter.faction ?? '';
			
			// Update the store with existing data so it persists
			onboardingData.update((d) => ({
				...d,
				name: data.existingCharacter?.name ?? '',
				appearance: data.existingCharacter?.appearance ?? '',
				faction: data.existingCharacter?.faction ?? ''
			}));
		} else {
			// Otherwise use store data
			name = current.name ?? '';
			appearance = current.appearance ?? '';
			factionValue = current.faction ?? '';
		}
		
		// Always use store data for attributes and tutorial
		allocation = current.attributes ?? {};
		tutorial = current.tutorial ?? false;
	});

	const pointsUsed = $derived<number>(
		data?.attributes
			? data.attributes.reduce(
					(sum: number, attr: { name: string; baseValue: number }) =>
						sum + (Number(allocation[attr.name] ?? attr.baseValue) - Number(attr.baseValue)),
					0
				)
			: 0
	);
	const pointsLeft = $derived<number>(totalPoints - pointsUsed);

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

	function setName(v: string) {
		name = v;
		onboardingData.update((d) => ({ ...d, name: v }));
	}
	function setAppearance(v: string) {
		appearance = v;
		onboardingData.update((d) => ({ ...d, appearance: v }));
	}
	function setFaction(v: string) {
		factionValue = v;
		onboardingData.update((d) => ({ ...d, faction: v }));
	}
	function setAllocation(attrName: string, value: number) {
		const capped = Math.min(
			15,
			Math.max(
				value,
				data.attributes.find((a: { name: string; baseValue: number }) => a.name === attrName)
					?.baseValue ?? 0
			)
		);
		allocation = { ...allocation, [attrName]: capped };
		onboardingData.update((d) => ({ ...d, attributes: allocation }));
	}
	function setTutorial(v: boolean) {
		tutorial = v;
		onboardingData.update((d) => ({ ...d, tutorial: v }));
	}
</script>

<div class="container mx-auto max-w-5xl p-6">
	<div class="space-y-8">
		<!-- Header -->
		<div class="text-center">
			<h1 class="text-4xl font-bold text-primary-500 dark:text-primary-400 mb-2">Character Creation</h1>
			<p class="text-surface-600 dark:text-surface-400">
				{steps[currentStep].description}
			</p>
		</div>

		<!-- Stepper Timeline -->
		<div class="relative">
			<div class="flex items-center justify-between gap-2 sm:gap-4">
				{#each steps as step, i}
					<button
						class="btn-icon rounded-full transition-all {isCurrentStep(i)
							? 'preset-filled-primary-500'
							: i < currentStep
								? 'preset-filled-secondary-500'
								: 'preset-tonal-surface'}"
						onclick={() => setStep(i)}
						title={step.label}
						type="button"
						aria-label={`Step ${i + 1}: ${step.label}`}
					>
						{#if i < currentStep}
							<IconCheck class="size-5" />
						{:else}
							<span class="font-bold">{i + 1}</span>
						{/if}
					</button>
				{/each}
			</div>
			<div class="bg-surface-200 dark:bg-surface-800 absolute top-[50%] right-0 left-0 z-[-1] h-1"></div>
		</div>

		<!-- Step Content -->
		<div class="min-h-[400px]">
			<!-- Step 0: Introduction -->
			{#if isCurrentStep(0)}
				<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 mx-auto max-w-2xl space-y-6 p-10 text-center">
					<h2 class="text-3xl font-bold text-primary-500 dark:text-primary-400">Welcome to The Corelight Fall!</h2>
					<div class="text-surface-700 dark:text-surface-300 space-y-4">
						<p>
							The world is fractured, and you are called to shape its fate.
						</p>
						<p>
							Your journey begins now. Choose your path, forge your identity, and prepare to explore a world
							full of mystery and adventure.
						</p>
						<p class="text-primary-500 dark:text-primary-400 text-lg font-semibold">
							Ready to begin?
						</p>
					</div>
				</div>
			{/if}

			<!-- Step 1: Character -->
			{#if isCurrentStep(1)}
				<StepCharacter {name} {appearance} {setName} {setAppearance} />
			{/if}

			<!-- Step 2: Faction -->
			{#if isCurrentStep(2)}
				<StepFaction factions={data.factions} {factionValue} {setFaction} />
			{/if}

			<!-- Step 3: Attributes -->
			{#if isCurrentStep(3)}
				<StepAttributes attributes={data.attributes} {allocation} {setAllocation} {pointsLeft} />
			{/if}

			<!-- Step 4: Finalize -->
			{#if isCurrentStep(4)}
				<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 mx-auto max-w-2xl space-y-6 p-8">
					<div class="space-y-2">
						<h2 class="text-2xl font-bold text-primary-500 dark:text-primary-400">Review Your Character</h2>
						<p class="text-surface-700 dark:text-surface-300 text-sm">
							Confirm your choices before entering the world.
						</p>
					</div>

					<div class="space-y-4">
						<div class="card preset-outlined-surface-200-800 bg-surface-100 dark:bg-surface-800 p-4">
							<div class="font-bold text-surface-900 dark:text-surface-100 mb-1">Character Name</div>
							<div class="text-surface-700 dark:text-surface-300">{name || 'Not set'}</div>
						</div>

						<div class="card preset-outlined-surface-200-800 bg-surface-100 dark:bg-surface-800 p-4">
							<div class="font-bold text-surface-900 dark:text-surface-100 mb-1">Appearance</div>
							<div class="text-surface-700 dark:text-surface-300">{appearance || 'Not set'}</div>
						</div>

						<div class="card preset-outlined-surface-200-800 bg-surface-100 dark:bg-surface-800 p-4">
							<div class="font-bold text-surface-900 dark:text-surface-100 mb-1">Faction</div>
							<div class="text-surface-700 dark:text-surface-300">{factionValue || 'Not set'}</div>
						</div>

						<div class="card preset-outlined-surface-200-800 bg-surface-100 dark:bg-surface-800 p-4">
							<div class="font-bold text-surface-900 dark:text-surface-100 mb-2">Attributes</div>
							<div class="grid grid-cols-2 gap-2">
								{#each data.attributes as attr}
									<div class="flex justify-between">
										<span class="text-surface-700 dark:text-surface-300">{attr.name}:</span>
										<span class="font-semibold text-surface-900 dark:text-surface-100">
											{allocation[attr.name] ?? attr.baseValue}
										</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Step 5: Tutorial -->
			{#if isCurrentStep(5)}
				<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 mx-auto max-w-md space-y-6 p-8 text-center">
					<div class="space-y-2">
						<h2 class="text-2xl font-bold text-primary-500 dark:text-primary-400">Tutorial</h2>
						<p class="text-surface-700 dark:text-surface-300 text-sm">
							Would you like to start with a guided tutorial?
						</p>
					</div>

					<div class="flex justify-center gap-4">
						<label class="card preset-outlined-surface-200-800 bg-surface-100 dark:bg-surface-800 hover:preset-tonal-primary flex cursor-pointer items-center gap-3 px-6 py-4 transition-all">
							<input
								type="radio"
								name="tutorial"
								bind:group={tutorial}
								value={true}
								onchange={() => setTutorial(true)}
								required
							/>
							<span class="font-semibold text-surface-900 dark:text-surface-100">Yes, guide me</span>
						</label>
						<label class="card preset-outlined-surface-200-800 bg-surface-100 dark:bg-surface-800 hover:preset-tonal-primary flex cursor-pointer items-center gap-3 px-6 py-4 transition-all">
							<input
								type="radio"
								name="tutorial"
								bind:group={tutorial}
								value={false}
								onchange={() => setTutorial(false)}
							/>
							<span class="font-semibold text-surface-900 dark:text-surface-100">Skip tutorial</span>
						</label>
					</div>
				</div>
			{/if}
		</div>

		<!-- Navigation -->
		<nav class="flex items-center justify-between gap-4">
			<button
				type="button"
				class="btn preset-tonal-surface flex items-center gap-2"
				onclick={prevStep}
				disabled={currentStep === 0}
				aria-label="Previous step"
			>
				<IconArrowLeft class="size-5" />
				<span>Previous</span>
			</button>
			<button
				type="button"
				class="btn preset-filled-primary flex items-center gap-2"
				onclick={async () => {
					const forms = Array.from(document.querySelectorAll('form'));
					const form = forms.find((f) => f.offsetParent !== null);
					if (form) {
						const valid = form.reportValidity ? form.reportValidity() : true;
						if (!valid) return;
					}
					if (currentStep === steps.length - 1) {
						// Build a complete attributes object
						const completeAttributes: Record<string, number> = {};
						for (const attr of data.attributes) {
							completeAttributes[attr.name] =
								allocation[attr.name] !== undefined ? allocation[attr.name] : attr.baseValue;
						}

						const onboardingPayload = {
							...get(onboardingData),
							attributes: completeAttributes
						};

						const res = await fetch('/api/onboarding/complete', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(onboardingPayload)
						});
						if (res.ok) {
							console.log('Onboarding complete!');
							goto('/game');
						} else {
							alert('Failed to complete onboarding.');
						}
						return;
					}
					nextStep();
				}}
				disabled={(currentStep === 1 && !name) ||
					(currentStep === 2 && !factionValue) ||
					(currentStep === 3 && pointsLeft !== 0)}
			>
				<span>{currentStep === steps.length - 1 ? 'Enter the World' : 'Next'}</span>
				{#if currentStep === steps.length - 1}
					<IconCheck class="size-5" />
				{:else}
					<IconArrowRight class="size-5" />
				{/if}
			</button>
		</nav>
	</div>
</div>






