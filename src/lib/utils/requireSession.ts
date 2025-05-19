import { json } from '@sveltejs/kit';

export async function requireSession(locals: App.Locals) {
    if (!locals.user || !locals.session) {
        throw json({ error: 'Not authenticated' }, { status: 401 });
    }

    return true;
}