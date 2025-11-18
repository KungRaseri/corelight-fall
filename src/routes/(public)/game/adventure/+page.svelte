<script lang="ts">
	import Scene from '$lib/components/gameplay/Scene.svelte';
	import type { DialogScene } from '$lib/types/DialogScene';

	const scene: DialogScene = {
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

	function end() {
		console.log('End of scene');
	}
</script>

<Scene {scene} {end} />






