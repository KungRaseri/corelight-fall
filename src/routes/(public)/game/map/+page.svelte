<script lang="ts">
	import MapHeader from '$lib/components/layout/MapHeader.svelte';
	import MapDisplay from '$lib/components/gameplay/MapDisplay.svelte';
	import LocationDetails from '$lib/components/gameplay/LocationDetails.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let locations = [];
	let currentLocation = { name: 'Unknown', x: 0, y: 0 };
	let selectedLocation = null;

	onMount(() => {
		locations = page.data?.locations || [];
		currentLocation = page.data?.currentLocation || currentLocation;
	});

	function handleSelect(event) {
		selectedLocation = event.detail;
	}

	function closeDetails() {
		selectedLocation = null;
	}
</script>

<div class="p-6">
	<MapHeader {currentLocation} />
	<MapDisplay {locations} {currentLocation} on:locationSelected={handleSelect} />
	{#if selectedLocation}
		<LocationDetails {selectedLocation} on:close={closeDetails} />
	{/if}
</div>
