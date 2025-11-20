import { error } from '@sveltejs/kit';

export async function requireSession(locals: App.Locals) {
	if (!locals.user || !locals.session) {
		throw error(401, 'Not authenticated');
	}

	return true;
}
