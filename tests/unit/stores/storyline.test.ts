import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import {
	storylines,
	selectedStorylineId,
	selectedStoryLine
} from '../../../src/lib/stores/storyline.js';

describe('Storyline Store', () => {
	beforeEach(() => {
		// Reset all stores before each test
		storylines.set([]);
		selectedStorylineId.set(null);
		selectedStoryLine.set(null);
	});

	describe('storylines store', () => {
		it('should initialize as empty array', () => {
			const current = get(storylines);
			expect(Array.isArray(current)).toBe(true);
			expect(current.length).toBe(0);
		});

		it('should be a writable store', () => {
			const testStorylines = [
				{
					id: 1,
					title: 'The Beginning',
					description: 'A new adventure starts',
					isActive: true
				},
				{
					id: 2,
					title: 'The Journey',
					description: 'The path unfolds',
					isActive: false
				}
			];

			storylines.set(testStorylines);
			expect(get(storylines)).toEqual(testStorylines);
		});

		it('should be subscribable', () => {
			let currentStorylines;
			const unsubscribe = storylines.subscribe((value) => {
				currentStorylines = value;
			});

			expect(Array.isArray(currentStorylines)).toBe(true);
			expect(currentStorylines.length).toBe(0);

			const testStorylines = [{ id: 1, title: 'Test', description: 'Test storyline' }];
			storylines.set(testStorylines);
			expect(currentStorylines).toEqual(testStorylines);

			unsubscribe();
		});

		it('should handle empty array', () => {
			storylines.set([{ id: 1, title: 'Test' }]);
			expect(get(storylines).length).toBe(1);

			storylines.set([]);
			expect(get(storylines).length).toBe(0);
		});

		it('should handle multiple storylines', () => {
			const multipleStorylines = [
				{ id: 1, title: 'Storyline 1' },
				{ id: 2, title: 'Storyline 2' },
				{ id: 3, title: 'Storyline 3' },
				{ id: 4, title: 'Storyline 4' },
				{ id: 5, title: 'Storyline 5' }
			];

			storylines.set(multipleStorylines);
			expect(get(storylines).length).toBe(5);
			expect(get(storylines)[0].title).toBe('Storyline 1');
			expect(get(storylines).at(-1)?.title).toBe('Storyline 5');
		});
	});

	describe('selectedStorylineId store', () => {
		it('should initialize as null', () => {
			const id = get(selectedStorylineId);
			expect(id).toBeNull();
		});

		it('should be a writable store', () => {
			selectedStorylineId.set(42);
			expect(get(selectedStorylineId)).toBe(42);

			selectedStorylineId.set(null);
			expect(get(selectedStorylineId)).toBeNull();
		});

		it('should be subscribable', () => {
			let currentId;
			const unsubscribe = selectedStorylineId.subscribe((value) => {
				currentId = value;
			});

			expect(currentId).toBeNull();

			selectedStorylineId.set(10);
			expect(currentId).toBe(10);

			unsubscribe();
		});

		it('should handle different number values', () => {
			selectedStorylineId.set(1);
			expect(get(selectedStorylineId)).toBe(1);

			selectedStorylineId.set(999);
			expect(get(selectedStorylineId)).toBe(999);

			selectedStorylineId.set(0);
			expect(get(selectedStorylineId)).toBe(0);
		});

		it('should allow resetting to null', () => {
			selectedStorylineId.set(5);
			expect(get(selectedStorylineId)).toBe(5);

			selectedStorylineId.set(null);
			expect(get(selectedStorylineId)).toBeNull();
		});
	});

	describe('selectedStoryLine store', () => {
		it('should initialize as null', () => {
			const storyline = get(selectedStoryLine);
			expect(storyline).toBeNull();
		});

		it('should be a writable store', () => {
			const testStoryline = {
				id: 1,
				title: 'Selected Story',
				description: 'This is the selected storyline',
				isActive: true
			};

			selectedStoryLine.set(testStoryline);
			expect(get(selectedStoryLine)).toEqual(testStoryline);
		});

		it('should be subscribable', () => {
			let currentStoryline;
			const unsubscribe = selectedStoryLine.subscribe((value) => {
				currentStoryline = value;
			});

			expect(currentStoryline).toBeNull();

			const testStoryline = { id: 1, title: 'Test' };
			selectedStoryLine.set(testStoryline);
			expect(currentStoryline).toEqual(testStoryline);

			unsubscribe();
		});

		it('should allow setting to null', () => {
			const testStoryline = { id: 1, title: 'Test' };
			selectedStoryLine.set(testStoryline);
			expect(get(selectedStoryLine)).not.toBeNull();

			selectedStoryLine.set(null);
			expect(get(selectedStoryLine)).toBeNull();
		});

		it('should handle different storyline objects', () => {
			const storyline1 = { id: 1, title: 'First', description: 'First storyline' };
			const storyline2 = { id: 2, title: 'Second', description: 'Second storyline' };

			selectedStoryLine.set(storyline1);
			expect(get(selectedStoryLine)?.title).toBe('First');

			selectedStoryLine.set(storyline2);
			expect(get(selectedStoryLine)?.title).toBe('Second');
		});
	});

	describe('integration scenarios', () => {
		it('should handle selecting a storyline from list', () => {
			// Set up storylines
			const allStorylines = [
				{ id: 1, title: 'Story 1', description: 'First story' },
				{ id: 2, title: 'Story 2', description: 'Second story' },
				{ id: 3, title: 'Story 3', description: 'Third story' }
			];
			storylines.set(allStorylines);

			// Select storyline by ID
			selectedStorylineId.set(2);
			expect(get(selectedStorylineId)).toBe(2);

			// Set the full storyline object
			const selected = allStorylines.find((s) => s.id === 2);
			selectedStoryLine.set(selected!);
			expect(get(selectedStoryLine)?.title).toBe('Story 2');
		});

		it('should handle deselecting', () => {
			// Select a storyline
			selectedStorylineId.set(5);
			selectedStoryLine.set({ id: 5, title: 'Active Story' });

			expect(get(selectedStorylineId)).toBe(5);
			expect(get(selectedStoryLine)).not.toBeNull();

			// Deselect
			selectedStorylineId.set(null);
			selectedStoryLine.set(null);

			expect(get(selectedStorylineId)).toBeNull();
			expect(get(selectedStoryLine)).toBeNull();
		});

		it('should handle changing selection', () => {
			const storyline1 = { id: 1, title: 'First' };
			const storyline2 = { id: 2, title: 'Second' };

			// Select first
			selectedStorylineId.set(1);
			selectedStoryLine.set(storyline1);
			expect(get(selectedStorylineId)).toBe(1);
			expect(get(selectedStoryLine)?.title).toBe('First');

			// Change to second
			selectedStorylineId.set(2);
			selectedStoryLine.set(storyline2);
			expect(get(selectedStorylineId)).toBe(2);
			expect(get(selectedStoryLine)?.title).toBe('Second');
		});

		it('should handle updating storylines list while one is selected', () => {
			const initialStorylines = [
				{ id: 1, title: 'Story 1' },
				{ id: 2, title: 'Story 2' }
			];
			storylines.set(initialStorylines);
			selectedStorylineId.set(1);
			selectedStoryLine.set(initialStorylines[0]);

			// Update storylines list
			const updatedStorylines = [
				{ id: 1, title: 'Updated Story 1' },
				{ id: 2, title: 'Story 2' },
				{ id: 3, title: 'Story 3' }
			];
			storylines.set(updatedStorylines);

			// Selection should still point to same ID (but may need manual update)
			expect(get(selectedStorylineId)).toBe(1);
			expect(get(storylines).length).toBe(3);
		});

		it('should work with multiple subscriptions', () => {
			let storylinesList;
			let selectedId;
			let selectedStory;

			const unsub1 = storylines.subscribe((value) => {
				storylinesList = value;
			});
			const unsub2 = selectedStorylineId.subscribe((value) => {
				selectedId = value;
			});
			const unsub3 = selectedStoryLine.subscribe((value) => {
				selectedStory = value;
			});

			// Initial state
			expect(storylinesList).toEqual([]);
			expect(selectedId).toBeNull();
			expect(selectedStory).toBeNull();

			// Update all
			const testStorylines = [{ id: 1, title: 'Test' }];
			storylines.set(testStorylines);
			selectedStorylineId.set(1);
			selectedStoryLine.set(testStorylines[0]);

			expect(storylinesList).toEqual(testStorylines);
			expect(selectedId).toBe(1);
			expect(selectedStory).toEqual(testStorylines[0]);

			unsub1();
			unsub2();
			unsub3();
		});
	});
});
