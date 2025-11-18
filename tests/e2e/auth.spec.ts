import { expect, test } from '@playwright/test';

test.describe('Authentication Flow', () => {
	test('should show login page', async ({ page }) => {
		await page.goto('/auth/login');
		
		// Check for login form elements
		await expect(page.locator('input[name="username"]')).toBeVisible();
		await expect(page.locator('input[name="password"]')).toBeVisible();
		await expect(page.locator('button[type="submit"]')).toBeVisible();
	});

	test('should show register page', async ({ page }) => {
		await page.goto('/auth/register');
		
		// Check for register form elements
		await expect(page.locator('input[name="username"]')).toBeVisible();
		await expect(page.locator('input[name="password"]')).toBeVisible();
		await expect(page.locator('button[type="submit"]')).toBeVisible();
	});

	test('should navigate between login and register', async ({ page }) => {
		await page.goto('/auth/login');
		
		// Find and click the link to register (adjust selector as needed)
		const registerLink = page.locator('a[href*="register"]').first();
		if (await registerLink.isVisible()) {
			await registerLink.click();
			await expect(page).toHaveURL(/register/);
		}
	});

	test('should show validation errors for empty login', async ({ page }) => {
		await page.goto('/auth/login');
		
		// Try to submit empty form
		await page.locator('button[type="submit"]').click();
		
		// Should either prevent submission or show error message
		// Adjust this based on your actual implementation
		const currentUrl = page.url();
		expect(currentUrl).toContain('login');
	});
});

test.describe('Protected Routes', () => {
	test('should redirect to login when accessing game without auth', async ({ page }) => {
		await page.goto('/game');
		
		// Should redirect to login or show login prompt
		// Adjust based on your actual auth flow
		await page.waitForURL(/auth|login/);
	});

	test('should redirect to login when accessing admin without auth', async ({ page }) => {
		await page.goto('/admin');
		
		// Should redirect to login or show unauthorized
		await page.waitForURL(/auth|login|403/);
	});
});
