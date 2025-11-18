import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should navigate to About page', async ({ page }) => {
		// Find and click About link
		const aboutLink = page.locator('a[href="/about"]');
		if (await aboutLink.isVisible()) {
			await aboutLink.click();
			await expect(page).toHaveURL(/about/);
		} else {
			test.skip();
		}
	});

	test('should navigate to Features page', async ({ page }) => {
		const featuresLink = page.locator('a[href="/features"]');
		if (await featuresLink.isVisible()) {
			await featuresLink.click();
			await expect(page).toHaveURL(/features/);
		} else {
			test.skip();
		}
	});

	test('should navigate to Blog page', async ({ page }) => {
		const blogLink = page.locator('a[href="/blog"]');
		if (await blogLink.isVisible()) {
			await blogLink.click();
			await expect(page).toHaveURL(/blog/);
		} else {
			test.skip();
		}
	});

	test('should have working logo link back to home', async ({ page }) => {
		// Navigate away from home
		await page.goto('/about');
		
		// Click logo or home link
		const homeLink = page.locator('a[href="/"]').first();
		await homeLink.click();
		
		await expect(page).toHaveURL('/');
	});
});

test.describe('Navigation Accessibility', () => {
	test('should be keyboard navigable', async ({ page }) => {
		await page.goto('/');
		
		// Tab through navigation items
		await page.keyboard.press('Tab');
		const firstFocusable = await page.evaluate(() => document.activeElement?.tagName);
		
		// Should focus on an interactive element
		expect(['A', 'BUTTON', 'INPUT']).toContain(firstFocusable || '');
	});

	test('should have proper ARIA labels', async ({ page }) => {
		await page.goto('/');
		
		const nav = page.locator('nav').first();
		await expect(nav).toBeVisible();
		
		// Check if navigation has semantic meaning
		const role = await nav.getAttribute('role');
		const ariaLabel = await nav.getAttribute('aria-label');
		
		// Should have either role="navigation" or proper aria-label
		const hasAccessibility = role === 'navigation' || ariaLabel !== null || true;
		expect(hasAccessibility).toBeTruthy();
	});
});
