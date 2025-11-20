import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { sidebarExpanded, toggleSidebar, setSidebar } from '../../../src/lib/stores/sidebar.js';

describe('Sidebar Store', () => {
	beforeEach(() => {
		// Reset sidebar to default state
		sidebarExpanded.set(true);
	});

	it('should initialize as true (expanded)', () => {
		const expanded = get(sidebarExpanded);
		expect(expanded).toBe(true);
	});

	it('should be a writable store', () => {
		sidebarExpanded.set(false);
		expect(get(sidebarExpanded)).toBe(false);

		sidebarExpanded.set(true);
		expect(get(sidebarExpanded)).toBe(true);
	});

	it('should be subscribable', () => {
		let currentState;
		const unsubscribe = sidebarExpanded.subscribe((value) => {
			currentState = value;
		});

		expect(currentState).toBe(true);

		sidebarExpanded.set(false);
		expect(currentState).toBe(false);

		unsubscribe();
	});

	describe('toggleSidebar', () => {
		it('should toggle from true to false', () => {
			sidebarExpanded.set(true);
			expect(get(sidebarExpanded)).toBe(true);

			toggleSidebar();
			expect(get(sidebarExpanded)).toBe(false);
		});

		it('should toggle from false to true', () => {
			sidebarExpanded.set(false);
			expect(get(sidebarExpanded)).toBe(false);

			toggleSidebar();
			expect(get(sidebarExpanded)).toBe(true);
		});

		it('should toggle multiple times', () => {
			sidebarExpanded.set(true);

			toggleSidebar();
			expect(get(sidebarExpanded)).toBe(false);

			toggleSidebar();
			expect(get(sidebarExpanded)).toBe(true);

			toggleSidebar();
			expect(get(sidebarExpanded)).toBe(false);

			toggleSidebar();
			expect(get(sidebarExpanded)).toBe(true);
		});

		it('should work with subscription', () => {
			let currentState;
			const unsubscribe = sidebarExpanded.subscribe((value) => {
				currentState = value;
			});

			expect(currentState).toBe(true);

			toggleSidebar();
			expect(currentState).toBe(false);

			toggleSidebar();
			expect(currentState).toBe(true);

			unsubscribe();
		});
	});

	describe('setSidebar', () => {
		it('should set sidebar to expanded', () => {
			sidebarExpanded.set(false);
			expect(get(sidebarExpanded)).toBe(false);

			setSidebar(true);
			expect(get(sidebarExpanded)).toBe(true);
		});

		it('should set sidebar to collapsed', () => {
			sidebarExpanded.set(true);
			expect(get(sidebarExpanded)).toBe(true);

			setSidebar(false);
			expect(get(sidebarExpanded)).toBe(false);
		});

		it('should handle setting to same value', () => {
			sidebarExpanded.set(true);
			setSidebar(true);
			expect(get(sidebarExpanded)).toBe(true);

			sidebarExpanded.set(false);
			setSidebar(false);
			expect(get(sidebarExpanded)).toBe(false);
		});

		it('should work multiple times', () => {
			setSidebar(false);
			expect(get(sidebarExpanded)).toBe(false);

			setSidebar(true);
			expect(get(sidebarExpanded)).toBe(true);

			setSidebar(false);
			expect(get(sidebarExpanded)).toBe(false);
		});

		it('should trigger subscriptions', () => {
			let currentState;
			const unsubscribe = sidebarExpanded.subscribe((value) => {
				currentState = value;
			});

			setSidebar(false);
			expect(currentState).toBe(false);

			setSidebar(true);
			expect(currentState).toBe(true);

			unsubscribe();
		});
	});

	describe('integration scenarios', () => {
		it('should handle mixed operations', () => {
			// Start expanded
			expect(get(sidebarExpanded)).toBe(true);

			// Collapse with setSidebar
			setSidebar(false);
			expect(get(sidebarExpanded)).toBe(false);

			// Toggle to expand
			toggleSidebar();
			expect(get(sidebarExpanded)).toBe(true);

			// Toggle to collapse
			toggleSidebar();
			expect(get(sidebarExpanded)).toBe(false);

			// Explicitly expand
			setSidebar(true);
			expect(get(sidebarExpanded)).toBe(true);
		});

		it('should handle rapid toggles', () => {
			// Explicitly start from a known state
			sidebarExpanded.set(false);
			expect(get(sidebarExpanded)).toBe(false);

			// Toggle 10 times from false
			for (let i = 0; i < 10; i++) {
				toggleSidebar();
			}

			// After 10 toggles from false: false -> true -> false -> ... -> false (ends false)
			expect(get(sidebarExpanded)).toBe(false);
		});

		it('should work with subscription throughout operations', () => {
			const states: boolean[] = [];
			const unsubscribe = sidebarExpanded.subscribe((value) => {
				states.push(value);
			});

			// Initial state
			expect(states[0]).toBe(true);

			toggleSidebar();
			expect(states.at(-1)).toBe(false);

			setSidebar(true);
			expect(states.at(-1)).toBe(true);

			toggleSidebar();
			expect(states.at(-1)).toBe(false);

			unsubscribe();
		});
	});
});
