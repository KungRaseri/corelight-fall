<script lang="ts">
	import IconArrowLeft from '@lucide/svelte/icons/arrow-left';
	import IconArrowRight from '@lucide/svelte/icons/arrow-right';
	import StepCharacter from '$lib/components/onboarding/StepCharacter.svelte';
	import StepFaction from '$lib/components/onboarding/StepFaction.svelte';
	import StepAttributes from '$lib/components/onboarding/StepAttributes.svelte';
	import { onboardingData } from '$lib/stores/onboarding';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';

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

	// Sync local state with onboardingData store
	let name = $state(get(onboardingData).name ?? '');
	let appearance = $state(get(onboardingData).appearance ?? '');
	let factionValue = $state(get(onboardingData).faction ?? '');
	let allocation = $state<Record<string, number>>(get(onboardingData).attributes ?? {});
	let tutorial = $state(get(onboardingData).tutorial ?? '');

	let totalPoints = 10;

	// Initialize allocation with base values from data.attributes (only once)
	$effect(() => {
		if (data?.attributes && Object.keys(allocation).length === 0) {
			const initial: Record<string, number> = {};
			for (const attr of data.attributes) {
				initial[attr.name] = attr.baseValue;
			}
			allocation = initial;
			onboardingData.update((d) => ({ ...d, attributes: initial }));
		}
	});

	// Keep onboardingData in sync with local state
	$effect(() => {
		onboardingData.update((d) => ({
			...d,
			name,
			appearance,
			faction: factionValue,
			attributes: allocation,
			tutorial
		}));
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
	}
	function setAppearance(v: string) {
		appearance = v;
	}
	function setFaction(v: string) {
		factionValue = v;
	}
	function setAllocation(name: string, value: number) {
		const capped = Math.min(
			15,
			Math.max(value, data.attributes.find((a) => a.name === name)?.baseValue ?? 0)
		);
		allocation = { ...allocation, [name]: capped };
	}
	function setTutorial(v: boolean) {
		tutorial = v;
	}
</script>

<div class="w-full">
	<div class="space-y-8">
		<!-- Stepper Timeline -->
		<div class="relative">
			<div class="flex items-center justify-between gap-4">
				{#each steps as step, i}
					<button
						class="btn-icon btn-icon-sm rounded-full {isCurrentStep(i)
							? 'preset-filled-primary-500'
							: 'preset-filled-surface-200-800'}"
						onclick={() => setStep(i)}
						title={step.label}
						type="button"
					>
						<span class="font-bold">{i + 1}</span>
					</button>
				{/each}
			</div>
			<hr class="hr !border-surface-200-800 absolute top-[50%] right-0 left-0 z-[-1]" />
		</div>

		<!-- Step 0: Introduction -->
		{#if isCurrentStep(0)}
			<div class="card bg-surface-100-900 mx-auto max-w-xl space-y-4 p-10 text-center">
				<h2 class="h3 mb-2">{steps[0].label}</h2>
				<p>{steps[0].description}</p>
				<p>
					The world is fractured, and you are called to shape its fate.<br />
					Begin your journey by forging your identity.
				</p>
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
			<div class="card bg-surface-100-900 mx-auto max-w-xl space-y-4 p-10 text-left">
				<h2 class="h3 mb-4">{steps[4].label}</h2>
				<div>
					<div><b>Name:</b> {name}</div>
					<div><b>Appearance:</b> {appearance}</div>
					<div><b>Faction:</b> {factionValue}</div>
					<div>
						<b>Attributes:</b>
						<ul class="ml-4">
							{#each data.attributes as attr}
								<li>{attr.name}: {allocation[attr.name]}</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		{/if}

		<!-- Step 5: Tutorial -->
		{#if isCurrentStep(5)}
			<form
				class="card bg-surface-100-900 mx-auto max-w-md space-y-4 p-10 text-center"
				onsubmit={(e) => {
					e.preventDefault();
					// Save onboardingData here if needed
				}}
			>
				<h2 class="h3 mb-4">{steps[5].label}</h2>
				<p>Would you like to start with a guided tutorial?</p>
				<div class="flex justify-center gap-6">
					<label>
						<input
							type="radio"
							bind:group={tutorial}
							value={true}
							onchange={() => setTutorial(true)}
							required
						/>
						Yes
					</label>
					<label>
						<input
							type="radio"
							bind:group={tutorial}
							value={false}
							onchange={() => setTutorial(false)}
						/>
						No
					</label>
				</div>
			</form>
		{/if}

		<!-- Navigation -->
		<nav class="flex items-center justify-between gap-4">
			<button
				type="button"
				class="btn preset-tonal hover:preset-filled"
				onclick={prevStep}
				disabled={currentStep === 0}
			>
				<IconArrowLeft size={18} />
				<span>Previous</span>
			</button>
			<button
				type="button"
				class="btn preset-tonal hover:preset-filled"
				onclick={async () => {
					const forms = Array.from(document.querySelectorAll('form'));
					const form = forms.find((f) => f.offsetParent !== null);
					if (form) {
						const valid = form.reportValidity ? form.reportValidity() : true;
						if (!valid) return;
					}
					if (currentStep === steps.length - 1) {
						// Submit onboarding data to API
						const res = await fetch('/api/onboarding/complete', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(get(onboardingData))
						});
						if (res.ok) {
							// Optionally redirect or show a success message
							console.log('Onboarding complete!');
							// e.g., window.location.href = '/play';
              goto('/game')
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
				<span>{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</span>
				<IconArrowRight size={18} />
			</button>
		</nav>
	</div>
</div>
