import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should load successfully', async ({ page }) => {
		await expect(page).toHaveTitle('Corelight Fall');
	});

	test('should display main heading', async ({ page }) => {
		const heading = page.locator('h1').first();
		await expect(heading).toBeVisible();
	});

	test('should have navigation', async ({ page }) => {
		const nav = page.locator('nav');
		await expect(nav).toBeVisible();
	});

	test('should not have console errors', async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				errors.push(msg.text());
			}
		});

		await page.waitForLoadState('networkidle');
		
		// Filter out known third-party errors if any
		const relevantErrors = errors.filter(error => 
			!error.includes('Third party') && 
			!error.includes('extension')
		);
		
		expect(relevantErrors).toHaveLength(0);
	});

	test('should be responsive', async ({ page }) => {
		// Test desktop
		await page.setViewportSize({ width: 1920, height: 1080 });
		await expect(page.locator('body')).toBeVisible();

		// Test tablet
		await page.setViewportSize({ width: 768, height: 1024 });
		await expect(page.locator('body')).toBeVisible();

		// Test mobile
		await page.setViewportSize({ width: 375, height: 667 });
		await expect(page.locator('body')).toBeVisible();
	});
});
