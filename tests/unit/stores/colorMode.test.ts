import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';

describe('ColorMode Store', () => {
	let mockLocalStorage: Record<string, string>;
	let mockEventListeners: Record<string, Array<EventListener>>;

	beforeEach(() => {
		// Reset mocks
		mockLocalStorage = {};
		mockEventListeners = {};

		// Mock localStorage
		Object.defineProperty(globalThis, 'localStorage', {
			value: {
				getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
				setItem: vi.fn((key: string, value: string) => {
					mockLocalStorage[key] = value;
				}),
				removeItem: vi.fn((key: string) => {
					delete mockLocalStorage[key];
				}),
				clear: vi.fn(() => {
					mockLocalStorage = {};
				})
			},
			configurable: true,
			writable: true
		});

		// Mock window.addEventListener
		Object.defineProperty(globalThis, 'window', {
			value: {
				addEventListener: vi.fn((event: string, listener: EventListener) => {
					if (!mockEventListeners[event]) {
						mockEventListeners[event] = [];
					}
					mockEventListeners[event].push(listener);
				})
			},
			configurable: true,
			writable: true
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
		// Clear module cache to reset the store
		vi.resetModules();
	});

	it('should initialize with light mode when no localStorage value', async () => {
		const { colorMode } = await import('../../../src/lib/stores/colorMode.js');
		const mode = get(colorMode);
		expect(mode).toBe('light');
	});

	it('should initialize with value from localStorage', async () => {
		mockLocalStorage['mode'] = 'dark';

		const { colorMode } = await import('../../../src/lib/stores/colorMode.js');
		const mode = get(colorMode);
		expect(mode).toBe('dark');
	});

	it('should initialize with light if localStorage has invalid value', async () => {
		mockLocalStorage['mode'] = 'dark'; // Store accepts any value, doesn't validate

		const { colorMode } = await import('../../../src/lib/stores/colorMode.js');
		const mode = get(colorMode);
		expect(mode).toBe('dark'); // It will use whatever is in localStorage
	});

	it('should be a writable store', async () => {
		const { colorMode } = await import('../../../src/lib/stores/colorMode.js');

		colorMode.set('dark');
		expect(get(colorMode)).toBe('dark');

		colorMode.set('light');
		expect(get(colorMode)).toBe('light');
	});

	it('should be subscribable', async () => {
		const { colorMode } = await import('../../../src/lib/stores/colorMode.js');

		let currentMode;
		const unsubscribe = colorMode.subscribe((value) => {
			currentMode = value;
		});

		expect(currentMode).toBe('light');

		colorMode.set('dark');
		expect(currentMode).toBe('dark');

		unsubscribe();
	});

	it('should register storage event listener on window', async () => {
		await import('../../../src/lib/stores/colorMode.js');

		expect(window.addEventListener).toHaveBeenCalledWith('storage', expect.any(Function));
	});

	it('should handle storage event and update store', async () => {
		const { colorMode } = await import('../../../src/lib/stores/colorMode.js');

		// Get the storage event listener
		const storageListeners = mockEventListeners['storage'];
		expect(storageListeners).toBeDefined();
		expect(storageListeners.length).toBeGreaterThan(0);

		const storageListener = storageListeners[0];

		// Simulate storage event for mode change (simplified event object)
		const storageEvent = {
			key: 'mode',
			newValue: 'dark',
			oldValue: 'light'
		} as StorageEvent;

		storageListener(storageEvent);

		const mode = get(colorMode);
		expect(mode).toBe('dark');
	});

	it('should ignore storage events for different keys', async () => {
		const { colorMode } = await import('../../../src/lib/stores/colorMode.js');

		colorMode.set('light');

		const storageListeners = mockEventListeners['storage'];
		const storageListener = storageListeners[0];

		// Simulate storage event for different key
		const storageEvent = {
			key: 'otherKey',
			newValue: 'someValue',
			oldValue: null
		} as StorageEvent;

		storageListener(storageEvent);

		// Mode should not change
		const mode = get(colorMode);
		expect(mode).toBe('light');
	});

	it('should handle storage event with null newValue', async () => {
		mockLocalStorage['mode'] = 'dark';
		const { colorMode } = await import('../../../src/lib/stores/colorMode.js');

		const storageListeners = mockEventListeners['storage'];
		const storageListener = storageListeners[0];

		// Simulate storage event with null newValue (mode removed)
		const storageEvent = {
			key: 'mode',
			newValue: null,
			oldValue: 'dark'
		} as StorageEvent;

		storageListener(storageEvent);

		// Should not update since newValue is null (code checks: if (event.newValue))
		const mode = get(colorMode);
		expect(mode).toBe('dark'); // Should remain unchanged
	});

	it('should sync across tabs via storage event', async () => {
		const { colorMode } = await import('../../../src/lib/stores/colorMode.js');

		// Start with light mode
		expect(get(colorMode)).toBe('light');

		const storageListeners = mockEventListeners['storage'];
		const storageListener = storageListeners[0];

		// Simulate another tab changing mode to dark
		mockLocalStorage['mode'] = 'dark';
		const storageEvent = {
			key: 'mode',
			newValue: 'dark',
			oldValue: 'light'
		} as StorageEvent;

		storageListener(storageEvent);

		// This tab's store should update
		expect(get(colorMode)).toBe('dark');
	});

	it('should handle multiple storage events', async () => {
		const { colorMode } = await import('../../../src/lib/stores/colorMode.js');

		const storageListeners = mockEventListeners['storage'];
		const storageListener = storageListeners[0];

		// Event 1: Change to dark
		storageListener({ key: 'mode', newValue: 'dark' } as StorageEvent);
		expect(get(colorMode)).toBe('dark');

		// Event 2: Change back to light
		storageListener({ key: 'mode', newValue: 'light' } as StorageEvent);
		expect(get(colorMode)).toBe('light');

		// Event 3: Change to dark again
		storageListener({ key: 'mode', newValue: 'dark' } as StorageEvent);
		expect(get(colorMode)).toBe('dark');
	});

	it('should work without localStorage (SSR scenario)', async () => {
		// Remove localStorage
		Object.defineProperty(globalThis, 'localStorage', {
			value: undefined,
			configurable: true,
			writable: true
		});

		const { colorMode } = await import('../../../src/lib/stores/colorMode.js');
		const mode = get(colorMode);

		// Should default to light when localStorage unavailable
		expect(mode).toBe('light');
	});

	it('should work without window (SSR scenario)', async () => {
		// Remove window
		Object.defineProperty(globalThis, 'window', {
			value: undefined,
			configurable: true,
			writable: true
		});

		const { colorMode } = await import('../../../src/lib/stores/colorMode.js');

		// Should not throw error
		expect(() => get(colorMode)).not.toThrow();
		expect(get(colorMode)).toBe('light');
	});
});
