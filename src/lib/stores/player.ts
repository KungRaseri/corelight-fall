import { writable } from 'svelte/store';

export const player = writable(null);


export function setPlayer(data: any) {
    player.set(data);
}

export function clearPlayer() {
    player.set(null);
}