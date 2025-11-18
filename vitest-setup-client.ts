import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

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
