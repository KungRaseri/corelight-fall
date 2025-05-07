import { writable } from 'svelte/store';

export const sidebarExpanded = writable(true);

export function toggleSidebar() {
    sidebarExpanded.update((expanded) => !expanded);
}

export function setSidebar(expanded: boolean) {
    sidebarExpanded.set(expanded);
}
