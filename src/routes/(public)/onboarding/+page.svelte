<script lang="ts">
	import IconArrowLeft from '@lucide/svelte/icons/arrow-left';
	import IconArrowRight from '@lucide/svelte/icons/arrow-right';
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

	// Initialize local state from the store only once
	onMount(() => {
		const current = get(onboardingData);
		name = current.name ?? '';
		appearance = current.appearance ?? '';
		factionValue = current.faction ?? '';
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
				<h2 class="h3 mb-2">Welcome to The Corelight Fall!</h2>
				<p>
					The world is fractured, and you are called to shape its fate.<br />
					Your journey begins now. Choose your path, forge your identity, and prepare to explore a world
					full of mystery and adventure.
				</p>
				<p>
					<b>Ready to begin?</b>
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
								<li>{attr.name}: {allocation[attr.name] ?? attr.baseValue}</li>
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
				<span>{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</span>
				<IconArrowRight size={18} />
			</button>
		</nav>
	</div>
</div>
