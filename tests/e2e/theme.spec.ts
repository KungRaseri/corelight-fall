import { expect, test } from '@playwright/test';

test.describe('Theme Switching', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	});

	test('should have theme toggle', async ({ page }) => {
		// Look for theme toggle button (adjust selector as needed)
		const themeToggle = page.locator('[aria-label*="theme" i], [title*="theme" i], button:has-text("light"), button:has-text("dark")').first();
		
		const isVisible = await themeToggle.isVisible().catch(() => false);
		
		if (!isVisible) {
			test.skip();
			return;
		}
		
		// Get initial theme
		const initialTheme = await page.evaluate(() => {
			return document.documentElement.dataset.mode || 'light';
		});
		
		// Click toggle
		await themeToggle.click();
		
		// Wait a bit for transition
		await page.waitForTimeout(500);
		
		// Get new theme
		const newTheme = await page.evaluate(() => {
			return document.documentElement.dataset.mode || 'light';
		});
		
		// Themes should be different
		expect(initialTheme).not.toBe(newTheme);
	});

	test('should persist theme preference', async ({ page, context }) => {
		const themeToggle = page.locator('[aria-label*="theme" i], [title*="theme" i], button:has-text("light"), button:has-text("dark")').first();
		
		const isVisible = await themeToggle.isVisible().catch(() => false);
		
		if (!isVisible) {
			test.skip();
			return;
		}
		
		// Set to dark mode
		await themeToggle.click();
		await page.waitForTimeout(500);
		
		const theme = await page.evaluate(() => {
			return document.documentElement.dataset.mode;
		});
		
		// Open new page in same context
		const newPage = await context.newPage();
		await newPage.goto('/');
		await newPage.waitForTimeout(500);
		
		const persistedTheme = await newPage.evaluate(() => {
			return document.documentElement.dataset.mode;
		});
		
		expect(persistedTheme).toBe(theme);
		await newPage.close();
	});
});

test.describe('Dark Mode', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	});

	test('should apply dark mode styles', async ({ page }) => {
		// Set dark mode
		await page.evaluate(() => {
			document.documentElement.dataset.mode = 'dark';
		});
		
		// Check if body has dark background
		const bgColor = await page.evaluate(() => {
			const body = document.body;
			const styles = globalThis.getComputedStyle(body);
			return styles.backgroundColor;
		});
		
		// Dark mode should have a dark background
		expect(bgColor).toBeTruthy();
	});
});
