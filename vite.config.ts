import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	ssr: {
		noExternal: []
	},
	optimizeDeps: {
		exclude: ['@node-rs/argon2', '@node-rs/argon2-wasm32-wasi']
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest-setup-client.ts'],
		include: [
			'src/**/*.{test,spec}.{js,ts}'
		],
		exclude: [
			'node_modules',
			'dist',
			'.svelte-kit',
			'build',
			'tests/e2e/**',
			'tests/unit/**',
			'tests/integration/**'
		],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
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
