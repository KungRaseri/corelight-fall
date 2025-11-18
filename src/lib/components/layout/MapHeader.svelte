<script lang="ts">
	interface Props {
		currentLocation: { name: string; x: number; y: number };
	}

	let { currentLocation }: Props = $props();
</script>

<header class="bg-surface-800 dark:bg-surface-900 text-surface-100 dark:text-surface-50 p-4 shadow-md">
	<h2 class="text-2xl font-semibold">Map - {currentLocation.name}</h2>
	<p>Coordinates: ({currentLocation.x}, {currentLocation.y})</p>
</header>
