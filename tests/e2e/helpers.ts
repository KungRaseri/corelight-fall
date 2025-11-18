import { expect, type Page } from '@playwright/test';

/**
 * Helper to login a test user
 */
export async function loginTestUser(page: Page, username = 'testuser', password = 'password123') {
	await page.goto('/auth/login');
	await page.fill('input[name="username"]', username);
	await page.fill('input[name="password"]', password);
	await page.click('button[type="submit"]');
	
	// Wait for navigation after login
	await page.waitForURL(/game|dashboard/);
}

/**
 * Helper to create a test user account
 */
export async function registerTestUser(page: Page, username = 'testuser', password = 'password123') {
	await page.goto('/auth/register');
	await page.fill('input[name="username"]', username);
	await page.fill('input[name="password"]', password);
	await page.click('button[type="submit"]');
	
	// Wait for successful registration
	await page.waitForURL(/onboarding|game/);
}

/**
 * Helper to logout
 */
export async function logout(page: Page) {
	// Adjust selector based on your logout button
	const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")').first();
	
	if (await logoutButton.isVisible()) {
		await logoutButton.click();
		await page.waitForURL(/auth|login|^\/$/, { timeout: 5000 });
	}
}

/**
 * Helper to check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
	// Check for auth indicators in the page
	// Adjust based on your app's structure
	const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")').first();
	return await logoutButton.isVisible().catch(() => false);
}

/**
 * Helper to wait for network idle
 */
export async function waitForPageLoad(page: Page) {
	await page.waitForLoadState('domcontentloaded');
	await page.waitForLoadState('networkidle');
}

/**
 * Helper to check for console errors
 */
export async function collectConsoleErrors(page: Page): Promise<string[]> {
	const errors: string[] = [];
	
	page.on('console', (msg) => {
		if (msg.type() === 'error') {
			errors.push(msg.text());
		}
	});
	
	return errors;
}

/**
 * Helper to check accessibility
 */
export async function checkBasicAccessibility(page: Page) {
	// Check for proper heading hierarchy
	const h1Count = await page.locator('h1').count();
	expect(h1Count).toBeGreaterThan(0);
	expect(h1Count).toBeLessThanOrEqual(1); // Should only have one h1 per page
	
	// Check for alt text on images
	const images = await page.locator('img').all();
	for (const img of images) {
		const alt = await img.getAttribute('alt');
		expect(alt).not.toBeNull();
	}
}

/**
 * Helper to test responsive behavior
 */
export async function testResponsiveBreakpoints(page: Page, testFn: (viewport: string) => Promise<void>) {
	const viewports = {
		mobile: { width: 375, height: 667 },
		tablet: { width: 768, height: 1024 },
		desktop: { width: 1920, height: 1080 }
	};
	
	for (const [name, size] of Object.entries(viewports)) {
		await page.setViewportSize(size);
		await testFn(name);
	}
}

/**
 * Helper to switch theme
 */
export async function switchTheme(page: Page, mode: 'light' | 'dark') {
	await page.evaluate((theme) => {
		document.documentElement.dataset.mode = theme;
		localStorage.setItem('mode', theme);
	}, mode);
}

/**
 * Helper to get current theme
 */
export async function getCurrentTheme(page: Page): Promise<string> {
	return await page.evaluate(() => {
		return document.documentElement.dataset.mode || 'light';
	});
}

/**
 * Helper to fill form fields
 */
export async function fillForm(page: Page, fields: Record<string, string>) {
	for (const [name, value] of Object.entries(fields)) {
		await page.fill(`input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`, value);
	}
}

/**
 * Helper to wait for API response
 */
export async function waitForApiResponse(page: Page, urlPattern: string | RegExp) {
	return await page.waitForResponse(response => {
		const url = response.url();
		if (typeof urlPattern === 'string') {
			return url.includes(urlPattern);
		}
		return urlPattern.test(url);
	});
}
