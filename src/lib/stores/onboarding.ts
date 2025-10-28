import { writable } from 'svelte/store';

export const onboardingData = writable({
	name: '',
	appearance: '',
	faction: '',
	attributes: {},
	tutorial: false // true/false
});
