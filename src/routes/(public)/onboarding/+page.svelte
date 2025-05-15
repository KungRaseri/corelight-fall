<script lang="ts">
	import IconArrowLeft from '@lucide/svelte/icons/arrow-left';
	import IconArrowRight from '@lucide/svelte/icons/arrow-right';
	import { onboardingData } from '$lib/stores/onboarding';

	const { data } = $props();

	// Steps
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

	// Character step state
	let name = $state('');
	let appearance = $state('');

	// Faction step state
	let factionValue = $state('');

	// Attributes step state (use $state for each attribute, not a store object)
	let totalPoints = 10;
	let allocation = $state({});

	// Initialize allocation with base values from data.attributes (only once)
	$effect(() => {
		if (data?.attributes && Object.keys(allocation).length === 0) {
			const initial = {};
			for (const attr of data.attributes) {
				initial[attr.name] = attr.baseValue;
			}
			allocation = initial;
		}
	});

	// Points used and left (derived)
	const pointsUsed = $derived(() =>
		data?.attributes
			? data.attributes.reduce((sum, attr) => sum + (allocation[attr.name] - attr.baseValue), 0)
			: 0
	);
	const pointsLeft = $derived(() => totalPoints - pointsUsed);

	// Tutorial step state
	let tutorial = $state('');

	function isCurrentStep(index) {
		return currentStep === index;
	}
	function setStep(index) {
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
				<button class="btn btn-primary mt-4" type="button" onclick={nextStep}>Begin</button>
			</div>
		{/if}

		<!-- Step 1: Character -->
		{#if isCurrentStep(1)}
			<form
				class="card bg-surface-100-900 mx-auto max-w-md space-y-4 p-10 text-left"
				onsubmit={(e) => {
					e.preventDefault();
					nextStep();
				}}
			>
				<h2 class="h3 mb-4">{steps[1].label}</h2>
				<label class="block">
					<span class="font-semibold">Name</span>
					<input
						class="input w-full"
						bind:value={name}
						required
						maxlength="24"
						placeholder="Your character's name"
					/>
				</label>
				<label class="block">
					<span class="font-semibold">Appearance</span>
					<input
						class="input w-full"
						bind:value={appearance}
						maxlength="64"
						placeholder="Short description or keywords"
					/>
				</label>
				<button class="btn btn-primary mt-4" type="submit">Next</button>
			</form>
		{/if}

		<!-- Step 2: Faction -->
		{#if isCurrentStep(2)}
			<form
				class="card bg-surface-100-900 mx-auto max-w-md space-y-4 p-10 text-left"
				onsubmit={(e) => {
					e.preventDefault();
					nextStep();
				}}
			>
				<h2 class="h3 mb-4">{steps[2].label}</h2>
				<span class="font-semibold">Choose your faction:</span>
				{#each data.factions as faction}
					<label class="block">
						<input type="radio" bind:group={factionValue} value={faction.name} required />
						{faction.name} — {faction.description}
					</label>
				{/each}
				<button class="btn btn-primary mt-4" type="submit">Next</button>
			</form>
		{/if}

		<!-- Step 3: Attributes -->
		{#if isCurrentStep(3)}
			<form
				class="card bg-surface-100-900 mx-auto max-w-2xl space-y-4 p-10 text-left"
				onsubmit={(e) => {
					e.preventDefault();
					nextStep();
				}}
			>
				<h2 class="h3 mb-4">{steps[3].label}</h2>
				<p>You have <b>{pointsLeft}</b> points to distribute among your attributes.</p>
				{#each data.attributes as attr}
					<div class="mb-2 flex items-center gap-4">
						<label class="w-32 font-bold">{attr.name}</label>
						<span class="flex-1 text-left text-sm text-gray-500">{attr.description}</span>
						<input
							type="number"
							min={attr.baseValue}
							max={attr.baseValue + pointsLeft}
							bind:value={allocation[attr.name]}
							class="input w-16"
						/>
					</div>
				{/each}
				<button class="btn btn-primary mt-4" type="submit" disabled={pointsLeft !== 0}>Next</button>
			</form>
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
				<button class="btn btn-primary mt-4" type="button" onclick={nextStep}
					>Confirm & Continue</button
				>
			</div>
		{/if}

		<!-- Step 5: Tutorial -->
		{#if isCurrentStep(5)}
			<form
				class="card bg-surface-100-900 mx-auto max-w-md space-y-4 p-10 text-center"
				onsubmit={(e) => {
					e.preventDefault(); /* Save onboardingData here if needed */
				}}
			>
				<h2 class="h3 mb-4">{steps[5].label}</h2>
				<p>Would you like to start with a guided tutorial?</p>
				<div class="flex justify-center gap-6">
					<label>
						<input type="radio" bind:group={tutorial} value="yes" required />
						Yes
					</label>
					<label>
						<input type="radio" bind:group={tutorial} value="no" />
						No
					</label>
				</div>
				<button class="btn btn-primary mt-4" type="submit">Finish</button>
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
				onclick={nextStep}
				disabled={currentStep === steps.length - 1}
			>
				<span>Next</span>
				<IconArrowRight size={18} />
			</button>
		</nav>
	</div>
</div>
