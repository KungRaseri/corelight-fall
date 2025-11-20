import { describe, it, expect, beforeEach } from 'vitest';
import { tutorialStore, type TutorialHintId } from '../../../src/lib/stores/tutorial.js';
import { get } from 'svelte/store';

describe('Tutorial Store', () => {
	beforeEach(() => {
		// Clear localStorage before each test
		localStorage.clear();
		tutorialStore.reset();
	});

	it('should initialize with empty shown hints', () => {
		const state = get(tutorialStore);
		expect(state.shownHints.size).toBe(0);
	});

	it('should mark hint as shown', () => {
		tutorialStore.markHintShown('first-encounter');
		const state = get(tutorialStore);
		
		expect(state.shownHints.has('first-encounter')).toBe(true);
	});

	it('should check if hint has been seen', () => {
		const state1 = get(tutorialStore);
		expect(tutorialStore.hasSeenHint('skill-check-intro', state1)).toBe(false);

		tutorialStore.markHintShown('skill-check-intro');
		const state2 = get(tutorialStore);
		expect(tutorialStore.hasSeenHint('skill-check-intro', state2)).toBe(true);
	});

	it('should persist shown hints to localStorage', () => {
		tutorialStore.markHintShown('first-encounter');
		tutorialStore.markHintShown('level-up');

		// Check localStorage
		const stored = localStorage.getItem('tutorial-hints-shown');
		expect(stored).toBeTruthy();
		
		const parsed = JSON.parse(stored!);
		expect(parsed).toContain('first-encounter');
		expect(parsed).toContain('level-up');
	});

	it('should load shown hints from localStorage on initialization', () => {
		// Manually set localStorage
		localStorage.setItem('tutorial-hints-shown', JSON.stringify(['first-encounter', 'level-up']));

		// Create new store instance (simulates page reload)
		const newState = get(tutorialStore);
		
		// The store should have loaded the hints
		expect(tutorialStore.hasSeenHint('first-encounter', newState)).toBe(true);
		expect(tutorialStore.hasSeenHint('level-up', newState)).toBe(true);
	});

	it('should reset shown hints', () => {
		tutorialStore.markHintShown('first-encounter');
		tutorialStore.markHintShown('skill-check-intro');
		
		let state = get(tutorialStore);
		expect(state.shownHints.size).toBe(2);

		tutorialStore.reset();
		state = get(tutorialStore);
		expect(state.shownHints.size).toBe(0);
		
		// Should also clear localStorage
		expect(localStorage.getItem('tutorial-hints-shown')).toBe('[]');
	});

	it('should handle multiple hints correctly', () => {
		const hints: TutorialHintId[] = [
			'first-encounter',
			'skill-check-intro',
			'choice-consequences',
			'level-up'
		];

		for (const hint of hints) {
			tutorialStore.markHintShown(hint);
		}

		const state = get(tutorialStore);
		for (const hint of hints) {
			expect(tutorialStore.hasSeenHint(hint, state)).toBe(true);
		}
	});

	it('should not add duplicate hints', () => {
		tutorialStore.markHintShown('first-encounter');
		tutorialStore.markHintShown('first-encounter');
		tutorialStore.markHintShown('first-encounter');

		const state = get(tutorialStore);
		expect(state.shownHints.size).toBe(1);
	});
});
