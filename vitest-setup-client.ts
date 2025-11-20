import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Force Svelte 5 to run in browser mode (not SSR mode) for testing
// This ensures mount() is available and components render correctly
process.env.VITEST_BROWSER = 'true';

// Required for Svelte 5 + jsdom as jsdom does not support matchMedia
Object.defineProperty(globalThis, 'matchMedia', {
	writable: true,
	enumerable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});

// Mock IntersectionObserver
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
})) as unknown as typeof IntersectionObserver;

// Mock ResizeObserver
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
})) as unknown as typeof ResizeObserver;

// Mock Element.animate for Svelte transitions
if (typeof Element !== 'undefined') {
	Element.prototype.animate = vi.fn().mockImplementation(() => {
		const animation = {
			cancel: vi.fn(),
			finish: vi.fn(),
			pause: vi.fn(),
			play: vi.fn(),
			reverse: vi.fn(),
			onfinish: null as (() => void) | null,
			oncancel: null as (() => void) | null,
			playState: 'finished',
			ready: Promise.resolve(),
			finished: Promise.resolve()
		};
		
		// Immediately call onfinish to complete transitions in tests
		setTimeout(() => {
			if (animation.onfinish) animation.onfinish();
		}, 0);
		
		return animation as Animation;
	});
}

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {};

	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value.toString();
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		}
	};
})();

Object.defineProperty(globalThis, 'localStorage', {
	value: localStorageMock
});

// Mock SvelteKit modules
vi.mock('$app/environment', () => ({
	browser: true,
	building: false,
	dev: true,
	version: '0.0.0'
}));

vi.mock('$app/stores', () => ({
	page: { subscribe: vi.fn() },
	navigating: { subscribe: vi.fn() },
	updated: { subscribe: vi.fn() }
}));
