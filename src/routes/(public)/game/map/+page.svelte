<script lang="ts">
	import type { Location } from '$lib/types/Location';
	import MapHeader from '$lib/components/layout/MapHeader.svelte';
	import MapDisplay from '$lib/components/gameplay/MapDisplay.svelte';
	import LocationDetails from '$lib/components/gameplay/LocationDetails.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let locations: Location[] = [];
	let currentLocation: { name: string; x: number; y: number } = { name: 'Unknown', x: 0, y: 0 };
	let selectedLocation: Location | null = null;

	onMount(() => {
		locations = page.data?.locations || [];
		currentLocation = page.data?.currentLocation || currentLocation;
	});

	function handleSelect(location: Location) {
		selectedLocation = location;
	}

	function closeDetails() {
		selectedLocation = null;
	}
</script>

<div class="p-6">
	<MapHeader {currentLocation} />
	<MapDisplay {locations} {currentLocation} onlocationselected={handleSelect} />
	{#if selectedLocation}
		<LocationDetails {selectedLocation} onclose={closeDetails} />
	{/if}
</div>






