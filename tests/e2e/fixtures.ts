import { test as base, expect } from '@playwright/test';
import { loginTestUser, logout } from './helpers';

type TestFixtures = {
	authenticatedPage: typeof base;
	adminPage: typeof base;
};

/**
 * Fixture for tests that require an authenticated user
 */
export const test = base.extend<TestFixtures>({
	authenticatedPage: async ({ page }, use) => {
		// Setup: Login before each test
		await loginTestUser(page);
		
		// Provide the authenticated page to the test
		await use(page as any);
		
		// Teardown: Logout after each test
		await logout(page);
	},
	
	adminPage: async ({ page }, use) => {
		// Setup: Login as admin
		await loginTestUser(page, 'admin', 'corelight-fall123');
		
		// Provide the admin page to the test
		await use(page as any);
		
		// Teardown: Logout
		await logout(page);
	}
});

export { expect };
