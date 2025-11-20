import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type TutorialHintId =
	| 'first-encounter'
	| 'skill-check-intro'
	| 'choice-consequences'
	| 'level-up'
	| 'inventory-use'
	| 'faction-reputation';

interface TutorialState {
	shownHints: Set<TutorialHintId>;
}

function createTutorialStore() {
	const STORAGE_KEY = 'tutorial_progress';

	// Load from localStorage
	const loadState = (): TutorialState => {
		if (!browser) return { shownHints: new Set() };

		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				return {
					shownHints: new Set(parsed.shownHints || [])
				};
			}
		} catch (error) {
			console.error('Failed to load tutorial state:', error);
		}

		return { shownHints: new Set() };
	};

	const { subscribe, update } = writable<TutorialState>(loadState());

	// Persist to localStorage
	const persistState = (state: TutorialState) => {
		if (!browser) return;

		try {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					shownHints: Array.from(state.shownHints)
				})
			);
		} catch (error) {
			console.error('Failed to persist tutorial state:', error);
		}
	};

	return {
		subscribe,
		markHintShown: (hintId: TutorialHintId) => {
			update((state) => {
				const newState = {
					...state,
					shownHints: new Set(state.shownHints).add(hintId)
				};
				persistState(newState);
				return newState;
			});
		},
		hasSeenHint: (hintId: TutorialHintId, state: TutorialState): boolean => {
			return state.shownHints.has(hintId);
		},
		reset: () => {
			const newState: TutorialState = { shownHints: new Set<TutorialHintId>() };
			update(() => newState);
			persistState(newState);
		}
	};
}

export const tutorialStore = createTutorialStore();
