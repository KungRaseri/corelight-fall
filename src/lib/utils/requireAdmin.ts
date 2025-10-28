import { json } from '@sveltejs/kit';
import { hasRole } from './permissions';

export async function requireAdmin(locals: App.Locals) {
	if (!locals.user) {
		throw json({ error: 'Not authenticated' }, { status: 401 });
	}
	if (!locals.role) {
		throw json({ error: 'Role not found' }, { status: 403 });
	}

	const hasAccess = await hasRole(locals.role, 'admin');

	if (!hasAccess) {
		throw json({ error: 'Not authorized' }, { status: 403 });
	}

	return true;
}
