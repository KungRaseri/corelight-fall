import { writable } from 'svelte/store';
import type { PlayerStat, Stat } from '$lib/server/db/types';

export const playerStats = writable<{ stat: Stat, playerStat: PlayerStat }[]>([]);

export function setPlayerStats(stats: { stat: Stat, playerStat: PlayerStat }[]) {
    playerStats.set(stats);
}

export function updatePlayerStat(statId: number, newValue: number) {
    playerStats.update((stats) => {
        const statIndex = stats.findIndex(({ playerStat }) => playerStat.statId === statId);
        if (statIndex !== -1) {
            stats[statIndex].playerStat.value = newValue;
        }
        return stats;
    });
}
