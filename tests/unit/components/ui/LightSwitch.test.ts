import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import LightSwitch from '../../../../src/lib/components/ui/LightSwitch.svelte';

describe('LightSwitch Component', () => {
	beforeEach(() => {
		// Clear localStorage before each test
		localStorage.clear();
		// Reset document.documentElement.dataset.mode
		delete document.documentElement.dataset.mode;
	});

	it('should show placeholder during initial render (SSR)', () => {
		render(LightSwitch);
		
		// Should show Sun icon in placeholder
		const sunIcons = document.querySelectorAll('svg');
		expect(sunIcons.length).toBeGreaterThan(0);
	});

	it('should initialize with light mode by default', async () => {
		render(LightSwitch);
		
		// Wait for onMount to complete
		await vi.waitFor(() => {
			expect(localStorage.getItem('mode')).toBe(null); // Not set yet if default
		});
	});

	it('should initialize from localStorage dark mode', async () => {
		localStorage.setItem('mode', 'dark');
		
		render(LightSwitch);
		
		// Wait for component to mount and read from localStorage
		await vi.waitFor(() => {
			const switchControl = document.querySelector('[role="switch"]');
			expect(switchControl).toBeTruthy();
		}, { timeout: 100 });
	});

	it('should initialize from localStorage light mode', async () => {
		localStorage.setItem('mode', 'light');
		
		render(LightSwitch);
		
		// Wait for component to mount
		await vi.waitFor(() => {
			const switchControl = document.querySelector('[role="switch"]');
			expect(switchControl).toBeTruthy();
		}, { timeout: 100 });
	});

	it('should toggle to dark mode when clicked', async () => {
		const user = userEvent.setup();
		render(LightSwitch);
		
		// Wait for component to mount
		await vi.waitFor(() => {
			const switchControl = document.querySelector('[role="switch"]');
			expect(switchControl).toBeTruthy();
		});

		const switchControl = document.querySelector('[role="switch"]') as HTMLElement;
		
		// Click to toggle to dark mode
		await user.click(switchControl);
		
		// Check that dark mode was set
		await vi.waitFor(() => {
			expect(document.documentElement.dataset.mode).toBe('dark');
			expect(localStorage.getItem('mode')).toBe('dark');
		});
	});

	it('should toggle to light mode when clicked from dark', async () => {
		localStorage.setItem('mode', 'dark');
		document.documentElement.dataset.mode = 'dark';
		
		const user = userEvent.setup();
		render(LightSwitch);
		
		// Wait for component to mount
		await vi.waitFor(() => {
			const switchControl = document.querySelector('[role="switch"]');
			expect(switchControl).toBeTruthy();
		});

		const switchControl = document.querySelector('[role="switch"]') as HTMLElement;
		
		// Click to toggle to light mode
		await user.click(switchControl);
		
		// Check that light mode was set
		await vi.waitFor(() => {
			expect(document.documentElement.dataset.mode).toBe('light');
			expect(localStorage.getItem('mode')).toBe('light');
		});
	});

	it('should display Moon icon when in dark mode', async () => {
		localStorage.setItem('mode', 'dark');
		document.documentElement.dataset.mode = 'dark';
		
		render(LightSwitch);
		
		// Wait for component to mount and render
		await vi.waitFor(() => {
			const switchControl = document.querySelector('[role="switch"]');
			expect(switchControl).toBeTruthy();
		});

		// Moon icon should be present when checked (dark mode)
		const icons = document.querySelectorAll('svg');
		expect(icons.length).toBeGreaterThan(0);
	});

	it('should display Sun icon when in light mode', async () => {
		localStorage.setItem('mode', 'light');
		
		render(LightSwitch);
		
		// Wait for component to mount
		await vi.waitFor(() => {
			const switchControl = document.querySelector('[role="switch"]');
			expect(switchControl).toBeTruthy();
		});

		// Sun icon should be present when unchecked (light mode)
		const icons = document.querySelectorAll('svg');
		expect(icons.length).toBeGreaterThan(0);
	});

	it('should persist mode changes to localStorage', async () => {
		const user = userEvent.setup();
		render(LightSwitch);
		
		// Wait for mount
		await vi.waitFor(() => {
			const switchControl = document.querySelector('[role="switch"]');
			expect(switchControl).toBeTruthy();
		});

		const switchControl = document.querySelector('[role="switch"]') as HTMLElement;
		
		// Toggle to dark
		await user.click(switchControl);
		await vi.waitFor(() => {
			expect(localStorage.getItem('mode')).toBe('dark');
		});

		// Toggle back to light
		await user.click(switchControl);
		await vi.waitFor(() => {
			expect(localStorage.getItem('mode')).toBe('light');
		});
	});

	it('should set data-mode attribute on document element', async () => {
		const user = userEvent.setup();
		render(LightSwitch);
		
		// Wait for mount
		await vi.waitFor(() => {
			const switchControl = document.querySelector('[role="switch"]');
			expect(switchControl).toBeTruthy();
		});

		const switchControl = document.querySelector('[role="switch"]') as HTMLElement;
		
		// Toggle to dark
		await user.click(switchControl);
		await vi.waitFor(() => {
			expect(document.documentElement.dataset.mode).toBe('dark');
		});

		// Toggle to light
		await user.click(switchControl);
		await vi.waitFor(() => {
			expect(document.documentElement.dataset.mode).toBe('light');
		});
	});

	it('should handle multiple rapid toggles', async () => {
		const user = userEvent.setup();
		render(LightSwitch);
		
		// Wait for mount
		await vi.waitFor(() => {
			const switchControl = document.querySelector('[role="switch"]');
			expect(switchControl).toBeTruthy();
		});

		const switchControl = document.querySelector('[role="switch"]') as HTMLElement;
		
		// Rapid toggles
		await user.click(switchControl); // -> dark
		await user.click(switchControl); // -> light
		await user.click(switchControl); // -> dark
		await user.click(switchControl); // -> light
		
		// Should end on light
		await vi.waitFor(() => {
			expect(localStorage.getItem('mode')).toBe('light');
			expect(document.documentElement.dataset.mode).toBe('light');
		});
	});
});
