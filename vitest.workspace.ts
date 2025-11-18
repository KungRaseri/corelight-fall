import { defineWorkspace } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineWorkspace([
	{
		plugins: [tailwindcss(), sveltekit()],
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
		plugins: [tailwindcss(), sveltekit()],
		test: {
			name: 'integration',
			globals: true,
			environment: 'jsdom',
			setupFiles: ['./vitest-setup-client.ts'],
			include: ['tests/integration/**/*.{test,spec}.{js,ts}'],
			exclude: ['node_modules', 'dist', '.svelte-kit', 'build']
		}
	}
]);
