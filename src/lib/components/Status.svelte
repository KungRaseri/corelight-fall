<script lang="ts">
	import type { Player } from '$lib/server/db/types';
    import { player } from '$lib/stores/player';

    let playerData = $state<Player | null>(null);

    $effect(() => {
        const unsubscribe = player.subscribe((value) => {
            playerData = value;
        });
        return unsubscribe;
    });
</script>

<div class="bg-surface-800 p-4 rounded-md mb-4">
    <h2 class="text-xl font-semibold">Current Status</h2>
    <!-- <p>Health: {playerData.health ?? 'Unknown'}</p>
    <p>Resources: {playerData.resources ?? 0}</p>
    <p>Location: {playerData.location ?? 'Unknown'}</p> -->
</div>
