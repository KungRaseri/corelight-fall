<script lang="ts">
    import GameHeader from '$lib/components/GameHeader.svelte';
    import GameActions from '$lib/components/GameActions.svelte';
    import GameLog from '$lib/components/GameLog.svelte';

    let { children } = $props();
    let characterData;

    $effect(() => {
        character.subscribe(value => characterData = value);
    });
</script>

<div class="game-layout h-full flex flex-col bg-surface-900 text-surface-100">
    <!-- Game Header -->
    <GameHeader />

    <!-- Main Game Content -->
    <main class="flex-1 p-4 overflow-auto">
        {@render children()}
    </main>

    <!-- Game Actions -->
    <GameActions />

    <!-- Game Log -->
    <GameLog />
</div>
