<script lang="ts">
	import { onMount } from 'svelte';

	export let locations = [];
	export let currentLocation = { name: 'Unknown', x: 0, y: 0 };

	function selectLocation(location) {
		const event = new CustomEvent('locationSelected', { detail: location, bubbles: true });
		dispatchEvent(event);
	}

	onMount(() => {
		console.log('Map initialized');
	});
</script>

<div class="map-container bg-surface-900 rounded p-4">
	{#each locations as location}
		<button
			class="location-marker"
			style="position: absolute; top: {location.y}%; left: {location.x}%"
			onclick={() => selectLocation(location)}
		>
			📍
		</button>
	{/each}
	<div
		class="character-marker"
		style="position: absolute; top: {currentLocation.y}%; left: {currentLocation.x}%"
	>
		🧭
	</div>
</div>

<style>
	.map-container {
		position: relative;
		width: 100%;
		height: 400px;
		background-color: #222;
	}
	.location-marker,
	.character-marker {
		position: absolute;
		transform: translate(-50%, -50%);
		font-size: 1.5rem;
	}
</style>
