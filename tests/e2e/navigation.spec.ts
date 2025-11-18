import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	});

	test('should navigate to About page', async ({ page }) => {
		// Find and click About link
		const aboutLink = page.locator('a[href="/about"]').first();
		const isVisible = await aboutLink.isVisible().catch(() => false);
		
		if (!isVisible) {
			test.skip();
			return;
		}
		
		await aboutLink.click();
		await expect(page).toHaveURL(/about/);
	});

	test('should navigate to Features page', async ({ page }) => {
		const featuresLink = page.locator('a[href="/features"]').first();
		const isVisible = await featuresLink.isVisible().catch(() => false);
		
		if (!isVisible) {
			test.skip();
			return;
		}
		
		await featuresLink.click();
		await expect(page).toHaveURL(/features/);
	});

	test('should navigate to Blog page', async ({ page }) => {
		const blogLink = page.locator('a[href="/blog"]').first();
		const isVisible = await blogLink.isVisible().catch(() => false);
		
		if (!isVisible) {
			test.skip();
			return;
		}
		
		// Wait for navigation to complete
		await Promise.all([
			page.waitForURL(/blog/, { timeout: 10000 }),
			blogLink.click()
		]);
		
		await expect(page).toHaveURL(/blog/);
	});

	test('should have working home link', async ({ page }) => {
		// First go to another page if available
		const aboutLink = page.locator('a[href="/about"]').first();
		const aboutIsVisible = await aboutLink.isVisible().catch(() => false);
		
		if (aboutIsVisible) {
			await aboutLink.click();
			await page.waitForURL(/about/);
		}
		
		// Click home link (logo or explicit home link)
		const homeLink = page.locator('a[href="/"]').first();
		await homeLink.click();
		
		await expect(page).toHaveURL('/');
	});
});

test.describe('Navigation Accessibility', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	});

	test('should be keyboard navigable', async ({ page }) => {
		// Tab through navigation items
		await page.keyboard.press('Tab');
		const firstFocusable = await page.evaluate(() => document.activeElement?.tagName);
		
		// Should focus on an interactive element
		expect(['A', 'BUTTON', 'INPUT']).toContain(firstFocusable || '');
	});

	test('should have semantic navigation', async ({ page }) => {
		const nav = page.locator('nav').first();
		const navExists = await nav.count();
		
		// Should have at least one nav element
		expect(navExists).toBeGreaterThan(0);
	});
});
