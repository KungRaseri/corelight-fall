import type { Player } from '$lib/server/db/schema';
import { writable, type Writable } from 'svelte/store';

export const player: Writable<Player | null> = writable();

export function setPlayer(data: any) {
    player.set(data);
}

export function clearPlayer() {
    player.set(null);
}