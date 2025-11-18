# End-to-End (E2E) Tests

This directory contains end-to-end tests using Playwright to test the application from a user's perspective.

## Structure

```
tests/e2e/
├── home.spec.ts          # Homepage tests
├── auth.spec.ts          # Authentication flow tests
├── navigation.spec.ts    # Navigation and routing tests
├── theme.spec.ts         # Theme switching tests
├── helpers.ts            # Shared test utilities
├── fixtures.ts           # Custom Playwright fixtures
└── README.md            # This file
```

## Running Tests

### Run all e2e tests
```bash
npm run test:e2e
```

### Run with UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run in debug mode
```bash
npm run test:e2e:debug
```

### Run with browser visible (headed mode)
```bash
npm run test:e2e:headed
```

### Run specific browser
```bash
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit
```

### Run mobile tests only
```bash
npm run test:e2e:mobile
```

### View test report
```bash
npm run test:e2e:report
```

## Configuration

Tests are configured in [`playwright.config.ts`](../../playwright.config.ts) at the project root.

### Key Settings:
- **Base URL**: `http://localhost:5173` (dev server)
- **Test Directory**: `tests/e2e/`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Screenshots**: Captured on failure
- **Videos**: Retained on failure
- **Traces**: Captured on first retry

## Writing Tests

### Basic Test Structure

```typescript
import { expect, test } from '@playwright/test';

test.describe('Feature Name', () => {
	test('should do something', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('h1')).toBeVisible();
	});
});
```

### Using Helpers

```typescript
import { test, expect } from '@playwright/test';
import { loginTestUser, waitForPageLoad } from './helpers';

test('authenticated user flow', async ({ page }) => {
	await loginTestUser(page);
	await waitForPageLoad(page);
	// ... test authenticated features
});
```

### Using Fixtures

```typescript
import { test, expect } from './fixtures';

// This test will automatically have an authenticated user
test('should access protected page', async ({ authenticatedPage }) => {
	await authenticatedPage.goto('/game');
	await expect(authenticatedPage.locator('h1')).toBeVisible();
});

// This test will automatically have an admin user
test('should access admin panel', async ({ adminPage }) => {
	await adminPage.goto('/admin');
	await expect(adminPage.locator('h1')).toContainText('Admin');
});
```

## Best Practices

### 1. **Use Page Object Model (POM)**
For complex pages, create page objects to encapsulate page-specific logic:

```typescript
// pages/LoginPage.ts
export class LoginPage {
	constructor(private page: Page) {}
	
	async login(username: string, password: string) {
		await this.page.fill('input[name="username"]', username);
		await this.page.fill('input[name="password"]', password);
		await this.page.click('button[type="submit"]');
	}
}
```

### 2. **Use Data Test IDs**
Add `data-testid` attributes to elements for more reliable selectors:

```svelte
<button data-testid="submit-button">Submit</button>
```

```typescript
await page.locator('[data-testid="submit-button"]').click();
```

### 3. **Wait for Specific States**
Use explicit waits instead of timeouts:

```typescript
// ❌ Bad
await page.waitForTimeout(5000);

// ✅ Good
await page.waitForSelector('[data-testid="content"]');
await page.waitForLoadState('networkidle');
```

### 4. **Group Related Tests**
Use `describe` blocks to organize tests:

```typescript
test.describe('User Management', () => {
	test.describe('Creating Users', () => {
		test('should create user with valid data', async ({ page }) => {
			// ...
		});
	});
	
	test.describe('Deleting Users', () => {
		test('should delete user', async ({ page }) => {
			// ...
		});
	});
});
```

### 5. **Use beforeEach for Setup**
Reduce duplication with setup hooks:

```typescript
test.describe('Feature Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/feature');
	});
	
	test('test 1', async ({ page }) => {
		// page is already at /feature
	});
	
	test('test 2', async ({ page }) => {
		// page is already at /feature
	});
});
```

### 6. **Test User Workflows**
Test complete user journeys, not just individual actions:

```typescript
test('complete checkout flow', async ({ page }) => {
	await page.goto('/products');
	await page.click('[data-testid="product-1"]');
	await page.click('[data-testid="add-to-cart"]');
	await page.click('[data-testid="cart-icon"]');
	await page.click('[data-testid="checkout"]');
	await expect(page).toHaveURL(/checkout/);
});
```

### 7. **Handle Dynamic Content**
Wait for dynamic content to load:

```typescript
// Wait for API response
await page.waitForResponse(response => 
	response.url().includes('/api/data') && response.status() === 200
);

// Wait for element with text
await page.waitForSelector('text=Welcome back');
```

## Debugging

### Run specific test
```bash
npx playwright test auth.spec.ts
```

### Run specific test by name
```bash
npx playwright test -g "should login"
```

### Show browser while testing
```bash
npm run test:e2e:headed
```

### Debug with Playwright Inspector
```bash
npm run test:e2e:debug
```

### View trace of failed test
```bash
npm run test:e2e:report
# Click on failed test to see trace
```

## CI/CD

The configuration is CI-ready:
- Tests run in headless mode
- 2 retries on failure
- Sequential execution (workers: 1)
- HTML reports generated

Example GitHub Actions:
```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run E2E Tests
  run: npm run test:e2e

- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Troubleshooting

### "Browser not found" error
Install browsers:
```bash
npx playwright install
```

### "Port already in use" error
The dev server might already be running. Stop it and try again, or set `reuseExistingServer: true` in config.

### Tests are slow
- Reduce `timeout` values in config
- Use `test.describe.configure({ mode: 'parallel' })` for parallel execution
- Run specific browsers instead of all

### Flaky tests
- Use `await page.waitForLoadState('networkidle')`
- Increase timeout for specific actions
- Use more specific selectors
- Add retries in config

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
