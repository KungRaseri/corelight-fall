<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import { colorMode } from '$lib/stores/colorMode';

	let checked = $state(false);

	$effect(() => {
		const mode = localStorage.getItem('mode') || 'light';
		checked = mode === 'dark';
		colorMode.set(mode);
	});

	const onCheckedChange = (event: { checked: boolean }) => {
		const mode = event.checked ? 'dark' : 'light';
		document.documentElement.setAttribute('data-mode', mode);
		localStorage.setItem('mode', mode);
		checked = event.checked;
		colorMode.set(mode);
	};
</script>

<Switch {checked} {onCheckedChange}></Switch>
