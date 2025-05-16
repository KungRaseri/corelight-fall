import type { Character } from '$lib/server/db/types';
import { writable, type Writable } from 'svelte/store';

export const character: Writable<Character | null> = writable();

export function setCharacter(data: any) {
    character.set(data);
}

export function clearCharacter() {
    character.set(null);
}
