import { redirect, fail } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

export const POST = async (event) => {
    if (!event.locals.session) {
        return new Response(JSON.stringify({ message: 'Session not found' }), { status: 401 });
    }
    await auth.invalidateSession(event.locals.session.id);
    auth.deleteSessionTokenCookie(event);

    return redirect(302, '/auth/login');
}