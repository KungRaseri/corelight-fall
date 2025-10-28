# GitHub Copilot Instructions - Corelight Fall RPG

## Project Overview
This is a SvelteKit 2.x RPG web application with:
- **Framework**: SvelteKit 2.16+ with Svelte 5 (Runes mode enabled)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.0 + Skeleton UI components
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Lucia auth (custom implementation)
- **i18n**: Paraglide (inlang)
- **Testing**: Vitest + Playwright + Storybook
- **Package Manager**: npm

## Code Standards & Best Practices

### 1. SvelteKit & Svelte 5 Runes
- **ALWAYS** use Svelte 5 runes syntax (`$state`, `$derived`, `$effect`, `$props`)
- **NEVER** use legacy stores for component state (no `writable`, `readable`, `derived`)
- Use `$lib` alias for imports from `src/lib`
- Follow SvelteKit routing conventions: `+page.svelte`, `+layout.svelte`, `+server.ts`
- Use form actions in `+page.server.ts` for form handling
- Implement proper load functions with type safety

### 2. TypeScript Standards
- Enable strict mode (already configured)
- Define types in `src/lib/types/` directory
- Use proper type annotations for function parameters and returns
- Avoid `any` type - use `unknown` or proper typing
- Export types alongside implementations when needed

### 3. File Organization
- **Components**: `src/lib/components/{feature}/ComponentName.svelte`
- **Types**: `src/lib/types/TypeName.ts`
- **Stores** (global only): `src/lib/stores/storeName.ts`
- **Utils**: `src/lib/utils/utilName.ts`
- **Server code**: `src/lib/server/` (database, auth)
- **API routes**: `src/routes/api/{feature}/+server.ts`
- **Pages**: `src/routes/(group)/page-name/+page.svelte`

### 4. Component Standards
- Use PascalCase for component filenames
- Use lowercase with hyphens for route folders
- Keep components focused and single-purpose
- Extract reusable UI elements to `src/lib/components/ui/`
- Use Skeleton UI components when available
- Props should use `$props()` rune with TypeScript interface

### 5. Database (Drizzle ORM)
- Schema files in `src/lib/server/db/schema/`
- Use barrelsby for schema exports (run `npm run generate:barrels`)
- Always use prepared statements for queries
- Implement proper error handling for DB operations
- Use transactions for multi-step operations
- Types should be inferred from schema using Drizzle's typing

### 6. Authentication & Authorization
- Auth logic in `src/lib/server/auth.ts`
- Use `requireSession` util for protected routes
- Use `requireAdmin` util for admin-only routes
- Implement `SafeUser` type (never expose sensitive data)
- Check permissions with `src/lib/utils/permissions.ts`

### 7. API Routes
- Group by feature: `/api/{feature}/{action}/+server.ts`
- Return proper HTTP status codes
- Use `json()` helper from SvelteKit
- Validate input data thoroughly
- Sanitize user input with `src/lib/utils/sanitizer.ts`
- Handle errors gracefully with try-catch

### 8. Styling
- Use Tailwind CSS utility classes
- Follow Skeleton UI theming system
- Custom theme: `src/lib/themes/corelight-fall.css`
- Use Tailwind plugins: forms, typography
- Mobile-first responsive design
- Use CSS variables for theme customization

### 9. Testing
- Unit tests: `.spec.ts` or `.test.ts` files alongside components
- E2E tests: `e2e/*.test.ts` (Playwright)
- Component stories: `src/stories/*.stories.svelte` (Storybook)
- Run tests before committing: `npm test`
- Maintain test coverage for critical paths

### 10. Internationalization
- Messages in `messages/{locale}.json`
- Use Paraglide for translations
- Import from `$lib/paraglide/messages`
- Always support both `en` and `es` locales

### 11. Code Quality
- Run `npm run format` before committing (Prettier)
- Run `npm run lint` to check ESLint rules
- Follow ESLint configuration (no `any`, proper typing)
- Use `npm run check` for type checking
- Write descriptive commit messages

### 12. Performance Best Practices
- Lazy load components when appropriate
- Use `$derived` for computed values (not functions)
- Avoid unnecessary reactivity
- Optimize images (use AVIF when possible)
- Implement proper error boundaries
- Use SvelteKit's built-in preloading

## Common Patterns

### Component with Props (Svelte 5)
```svelte
<script lang="ts">
	interface Props {
		title: string;
		count?: number;
	}
	
	let { title, count = 0 }: Props = $props();
	let doubled = $derived(count * 2);
</script>
```

### Form Action
```typescript
// +page.server.ts
export const actions = {
	default: async ({ request, locals }) => {
		const session = await requireSession(locals);
		const formData = await request.formData();
		// Process form data
		return { success: true };
	}
};
```

### API Route
```typescript
// +server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const session = await requireSession(locals);
		const data = await request.json();
		// Process data
		return json({ success: true });
	} catch (error) {
		return json({ error: 'Message' }, { status: 400 });
	}
};
```

## Commands Reference
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run check` - Type check
- `npm run lint` - Lint code
- `npm run format` - Format code
- `npm test` - Run all tests
- `npm run db:start` - Start PostgreSQL (Docker)
- `npm run db:push` - Push schema changes
- `npm run db:studio` - Open Drizzle Studio
- `npm run storybook` - Start Storybook

## Critical Reminders
1. **ALWAYS** use Svelte 5 runes - no legacy reactive statements
2. **NEVER** expose sensitive data from server to client
3. **ALWAYS** validate and sanitize user input
4. **ALWAYS** handle errors gracefully
5. **ALWAYS** use TypeScript - no implicit `any`
6. **ALWAYS** test authentication/authorization flows
7. **ALWAYS** use `$lib` alias for imports
8. **ALWAYS** follow the existing folder structure
9. **NEVER** commit without running linter and formatter
10. **ALWAYS** check for unused imports and variables
