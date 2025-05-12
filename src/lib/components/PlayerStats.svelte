<script lang="ts">
    import { playerStats } from '$lib/stores/playerStats';
    import type { PlayerStat, Stat } from '$lib/server/db/types';

    let stats: { stat: Stat, playerStat: PlayerStat }[] = [];
    playerStats.subscribe((value) => stats = value);
</script>

<div class="bg-surface-800 p-4 rounded-md shadow-md">
    <h2 class="text-xl font-semibold mb-2">Player Stats</h2>
    {#if stats.length > 0}
        <ul class="list-disc pl-6 space-y-1">
            {#each stats as { stat, playerStat }}
                <li>
                    <span class="font-bold">{stat.name}:</span> {playerStat.value} 
                    <span class="text-gray-400">({stat.description})</span>
                </li>
            {/each}
        </ul>
    {:else}
        <p>No stats available.</p>
    {/if}
</div>
