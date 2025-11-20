import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md']
		})
	],
	kit: { adapter: adapter() },
	extensions: ['.svelte', '.svx', '.md']
	// Remove global runes: true to allow third-party libraries to use legacy syntax
	// Runes are opt-in per component in Svelte 5 by default
};

export default config;
