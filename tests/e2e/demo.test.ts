import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
	test('should have expected h1', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should have navigation', async ({ page }) => {
		await page.goto('/');
		// Check if navigation exists
		const nav = page.locator('nav');
		await expect(nav).toBeVisible();
	});

	test('should load without errors', async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				errors.push(msg.text());
			}
		});

		await page.goto('/');
		expect(errors).toHaveLength(0);
	});
});
