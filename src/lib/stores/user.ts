import type { SafeUser } from '$lib/types/SafeUser';
import { writable, type Writable } from 'svelte/store';

export const user: Writable<SafeUser | null> = writable();

export function setUser(data: SafeUser | null) {
	user.set(data);
}

export function clearUser() {
	user.set(null);
}
