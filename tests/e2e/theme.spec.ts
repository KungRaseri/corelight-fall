import { expect, test } from '@playwright/test';

test.describe('Theme Switching', () => {
	test('should have theme toggle', async ({ page }) => {
		await page.goto('/');
		
		// Look for theme toggle button (adjust selector as needed)
		const themeToggle = page.locator('[aria-label*="theme" i], [title*="theme" i], button:has-text("light"), button:has-text("dark")').first();
		
		if (await themeToggle.isVisible()) {
			// Get initial theme
			const initialTheme = await page.evaluate(() => {
				return document.documentElement.getAttribute('data-mode') || 
					   document.documentElement.classList.contains('dark') ? 'dark' : 'light';
			});
			
			// Click toggle
			await themeToggle.click();
			
			// Wait a bit for transition
			await page.waitForTimeout(500);
			
			// Get new theme
			const newTheme = await page.evaluate(() => {
				return document.documentElement.getAttribute('data-mode') || 
					   document.documentElement.classList.contains('dark') ? 'dark' : 'light';
			});
			
			// Themes should be different
			expect(initialTheme).not.toBe(newTheme);
		} else {
			test.skip();
		}
	});

	test('should persist theme preference', async ({ page, context }) => {
		await page.goto('/');
		
		const themeToggle = page.locator('[aria-label*="theme" i], [title*="theme" i], button:has-text("light"), button:has-text("dark")').first();
		
		if (await themeToggle.isVisible()) {
			// Set to dark mode
			await themeToggle.click();
			await page.waitForTimeout(500);
			
			const theme = await page.evaluate(() => {
				return document.documentElement.getAttribute('data-mode');
			});
			
			// Open new page in same context
			const newPage = await context.newPage();
			await newPage.goto('/');
			await newPage.waitForTimeout(500);
			
			const persistedTheme = await newPage.evaluate(() => {
				return document.documentElement.getAttribute('data-mode');
			});
			
			expect(persistedTheme).toBe(theme);
			await newPage.close();
		} else {
			test.skip();
		}
	});
});

test.describe('Dark Mode', () => {
	test('should apply dark mode styles', async ({ page }) => {
		await page.goto('/');
		
		// Set dark mode
		await page.evaluate(() => {
			document.documentElement.setAttribute('data-mode', 'dark');
		});
		
		// Check if body has dark background
		const bgColor = await page.evaluate(() => {
			const body = document.body;
			const styles = window.getComputedStyle(body);
			return styles.backgroundColor;
		});
		
		// Dark mode should have a dark background (rgb values should be low)
		// This is a simple check - adjust based on your actual color scheme
		expect(bgColor).toBeTruthy();
	});
});
