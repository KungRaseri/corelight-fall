<script lang="ts">
	import type { DialogScene } from '$lib/types/DialogScene';
	import DialogBox from './DialogBox.svelte';

	const { scene } = $props<{ scene: DialogScene }>();
	const end = emit('end');

	let currentStepId = $state(scene.steps[0]?.id ?? '');
	let currentStep = $derived(scene.steps.find((s: { id: string }) => s.id === currentStepId));

	function handleChoice(value: string) {
		const choice = currentStep?.choices?.find(
			(c: { value: string; next?: string }) => c.value === value
		);
		if (choice?.next) {
			currentStepId = choice.next;
		} else if (currentStep?.next) {
			currentStepId = currentStep.next;
		} else {
			end();
		}
	}
</script>

{#if currentStep}
	<DialogBox
		speaker={currentStep.speaker}
		text={currentStep.text}
		portrait={currentStep.portrait}
		choices={currentStep.choices ?? []}
		onChoice={handleChoice}
	/>
{/if}
