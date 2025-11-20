import { error } from '@sveltejs/kit';
import { hasRole } from './permissions';

export async function requireAdmin(locals: App.Locals) {
	if (!locals.user) {
		throw error(401, 'Not authenticated');
	}
	if (!locals.role) {
		throw error(403, 'Role not found');
	}

	const hasAccess = await hasRole(locals.role, 'admin');

	if (!hasAccess) {
		throw error(403, 'Not authorized');
	}

	return true;
}
