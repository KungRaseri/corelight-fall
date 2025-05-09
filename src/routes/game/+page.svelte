<script lang="ts">
    import { page } from '$app/state';
    import { player } from '$lib/stores/player';
    import { onMount } from 'svelte';

    let gameState;
    let playerData;

    onMount(() => {
        player.subscribe(value => playerData = value);
        gameState = page.data?.gameState || 'Exploring the ruins...';
    });
</script>

<div class="p-6">
    <h2 class="text-xl font-bold mb-4">Game State</h2>
    <p class="text-lg">{gameState}</p>
</div>
