import { writable } from 'svelte/store';

export const onboardingData = writable({
    name: '',
    appearance: '',
    faction: '',
    attributes: {
        Vigor: 10,
        Nerve: 7,
        Finesse: 6,
        Ingenuity: 5,
        Presence: 5,
        Guile: 4,
        Sync: 1
    },
    tutorial: null // true/false
});