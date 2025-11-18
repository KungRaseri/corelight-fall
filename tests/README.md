# Testing Structure

This project uses a comprehensive testing strategy with three types of tests:

## Directory Structure

```
tests/
├── e2e/          # End-to-end tests (Playwright)
├── integration/  # Integration tests (Vitest)
└── unit/         # Unit tests (Vitest)
```

## Test Types

### Unit Tests (`tests/unit/`)
- **Purpose:** Test individual functions, utilities, and isolated components
- **Tool:** Vitest with jsdom
- **Run:** `npm run test:unit`
- **Watch mode:** `npm run test:unit:watch`
- **Example:** Testing pure functions, utility helpers, individual component logic

### Integration Tests (`tests/integration/`)
- **Purpose:** Test how multiple components/modules work together
- **Tool:** Vitest with jsdom
- **Run:** `npm run test:integration`
- **Watch mode:** `npm run test:integration:watch`
- **Example:** Testing API routes, database interactions, component combinations

### E2E Tests (`tests/e2e/`)
- **Purpose:** Test full user workflows in a real browser
- **Tool:** Playwright
- **Run:** `npm run test:e2e`
- **UI mode:** `npm run test:e2e:ui`
- **Debug mode:** `npm run test:e2e:debug`
- **Example:** Testing user registration flow, navigation, form submissions

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific test type
```bash
npm run test:unit
npm run test:integration
npm run test:e2e
```

### Watch mode (for development)
```bash
npm run test:unit:watch
npm run test:integration:watch
```

### Coverage report
```bash
npm run test:coverage
```

## Configuration Files

- **Playwright:** `playwright.config.ts`
- **Vitest:** `vite.config.ts` (test section)
- **Setup:** `vitest-setup-client.ts`

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest';

describe('MyFunction', () => {
  it('should return expected value', () => {
    expect(myFunction(input)).toBe(expectedOutput);
  });
});
```

### Integration Test Example
```typescript
import { describe, it, expect } from 'vitest';

describe('API Integration', () => {
  it('should handle request/response correctly', async () => {
    const result = await apiCall();
    expect(result).toHaveProperty('success');
  });
});
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test';

test('user can navigate to page', async ({ page }) => {
  await page.goto('/');
  await page.click('a[href="/about"]');
  await expect(page).toHaveURL('/about');
});
```

## Best Practices

1. **Unit tests** should be fast and isolated
2. **Integration tests** can use mocked external dependencies
3. **E2E tests** should test critical user paths only (they're slower)
4. Use descriptive test names that explain what's being tested
5. Follow the AAA pattern: Arrange, Act, Assert
6. Keep tests independent - they shouldn't rely on each other
