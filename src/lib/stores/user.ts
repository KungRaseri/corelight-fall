import type { User } from '$lib/server/db/types';
import { writable, type Writable } from 'svelte/store';

export const user: Writable<User | null> = writable();

export function setUser(data: any) {
    user.set(data);
}

export function clearUser() {
    user.set(null);
}