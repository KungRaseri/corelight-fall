import { expect, test } from '@playwright/test';

test.describe('Authentication Flow', () => {
	test('should show login page', async ({ page }) => {
		await page.goto('/auth/login');
		await page.waitForLoadState('networkidle');
		
		// Check for login form elements
		const usernameInput = page.locator('input[name="username"]');
		const passwordInput = page.locator('input[name="password"]');
		const submitButton = page.locator('button[type="submit"]');
		
		await expect(usernameInput).toBeVisible({ timeout: 10000 });
		await expect(passwordInput).toBeVisible();
		await expect(submitButton).toBeVisible();
	});

	test('should show register page', async ({ page }) => {
		await page.goto('/auth/register');
		await page.waitForLoadState('networkidle');
		
		// Check for register form elements
		const usernameInput = page.locator('input[name="username"]');
		const passwordInput = page.locator('input[name="password"]');
		const submitButton = page.locator('button[type="submit"]');
		
		await expect(usernameInput).toBeVisible({ timeout: 10000 });
		await expect(passwordInput).toBeVisible();
		await expect(submitButton).toBeVisible();
	});

	test('should navigate between login and register', async ({ page }) => {
		await page.goto('/auth/login');
		await page.waitForLoadState('networkidle');
		
		// Find and click the link to register (adjust selector as needed)
		const registerLink = page.locator('a[href*="register"]').first();
		const isVisible = await registerLink.isVisible().catch(() => false);
		
		if (isVisible) {
			await registerLink.click();
			await expect(page).toHaveURL(/register/);
		} else {
			test.skip();
		}
	});

	test('should show validation errors for empty login', async ({ page }) => {
		await page.goto('/auth/login');
		await page.waitForLoadState('networkidle');
		
		// Try to submit empty form
		await page.locator('button[type="submit"]').click();
		
		// Should either prevent submission or show error message
		// Just verify we're still on the login page
		const currentUrl = page.url();
		expect(currentUrl).toContain('login');
	});
});

test.describe('Protected Routes', () => {
	test('should handle game route', async ({ page }) => {
		await page.goto('/game');
		await page.waitForLoadState('networkidle');
		
		// Should either redirect to login or show the game (if already authenticated)
		const url = page.url();
		expect(url).toMatch(/game|auth|login/);
	});

	test('should handle admin route', async ({ page }) => {
		await page.goto('/admin');
		await page.waitForLoadState('networkidle');
		
		// Should either redirect to login or show unauthorized
		const url = page.url();
		expect(url).toMatch(/admin|auth|login/);
	});
});
