import { writable } from 'svelte/store';

// Initialize with current mode from localStorage or default to 'light'
const initialMode =
	typeof localStorage !== 'undefined' ? localStorage.getItem('mode') || 'light' : 'light';

export const colorMode = writable(initialMode);

// Optional: Listen for changes to localStorage from other tabs
if (typeof window !== 'undefined') {
	window.addEventListener('storage', (event) => {
		if (event.key === 'mode' && event.newValue) {
			colorMode.set(event.newValue);
		}
	});
}
