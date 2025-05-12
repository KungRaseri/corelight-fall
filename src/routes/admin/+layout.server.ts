// src/routes/admin/+page.server.ts
import { hasPermission } from '$lib/utils/permissions';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!locals.player) {
        throw redirect(302, '/auth/login');
    }

    // const hasAccess = await hasPermission(locals.player.id, 'view_admin');
    // if (!hasAccess) {
    //     throw redirect(302, '/');
    // }

    return {
        player: locals.player,
        message: 'Welcome to the admin panel!'
    };
};
