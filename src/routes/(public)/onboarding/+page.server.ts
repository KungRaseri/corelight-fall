import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	if (!locals.user) {
		redirect(302, '/auth/login');
	}

	if (locals.character) {
		redirect(302, '/game');
	}

	// Fetch attributes and factions from your API or DB
	const [attributesRes, factionsRes] = await Promise.all([
		fetch('/api/game/attributes'),
		fetch('/api/game/factions')
	]);
	const attributes = await attributesRes.json();
	const factions = await factionsRes.json();

	return { attributes, factions };
};
