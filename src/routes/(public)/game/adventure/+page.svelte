<script lang="ts">
	import DialogScene from '$lib/components/gameplay/DialogScene.svelte';
	import type { Scene } from '$lib/types/Scene';

	const myScene: Scene = {
		id: 'intro',
		steps: [
			{
				id: 'start',
				speaker: 'Guide',
				text: 'Welcome, traveler! Will you help us?',
				choices: [
					{ label: 'Yes', value: 'yes', next: 'accept' },
					{ label: 'No', value: 'no', next: 'decline' }
				]
			},
			{
				id: 'accept',
				speaker: 'Guide',
				text: 'Thank you! Your journey begins now.'
			},
			{
				id: 'decline',
				speaker: 'Guide',
				text: 'That is unfortunate. Safe travels.'
			}
		]
	};
</script>

<DialogScene {myScene} />
