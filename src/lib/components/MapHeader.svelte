<script lang="ts">
    export let currentLocation: { name: string; x: number; y: number };
</script>

<header class="bg-surface-800 p-4 text-surface-100 shadow-md">
    <h2 class="text-2xl font-semibold">Map - {currentLocation.name}</h2>
    <p>Coordinates: ({currentLocation.x}, {currentLocation.y})</p>
</header>
