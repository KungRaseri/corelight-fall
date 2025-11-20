import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// Vitest 4.0+ uses 'projects' instead of workspace files
export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib'),
			$app: path.resolve('./node_modules/@sveltejs/kit/src/runtime/app')
		}
	},
	test: {
		// Define multiple test projects
		projects: [
			{
				test: {
					name: 'unit',
					globals: true,
					environment: 'jsdom',
					setupFiles: ['./vitest-setup-client.ts'],
					include: ['tests/unit/**/*.{test,spec}.{js,ts}'],
					exclude: ['node_modules', 'dist', '.svelte-kit', 'build']
				}
			},
			{
				test: {
					name: 'integration',
					globals: true,
					environment: 'jsdom',
					setupFiles: ['./vitest-setup-client.ts'],
					include: ['tests/integration/**/*.{test,spec}.{js,ts}'],
					exclude: ['node_modules', 'dist', '.svelte-kit', 'build']
				}
			}
		],
		// Coverage configuration
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: [
				'src/lib/components/**/*.{js,ts,svelte}',
				'src/lib/stores/**/*.{js,ts}',
				'src/lib/utils/**/*.{js,ts}'
			],
			exclude: [
				'node_modules/',
				'tests/',
				'**/*.config.{js,ts}',
				'**/*.d.ts',
				'src/stories/**',
				'.storybook/**'
			]
		}
	}
});
