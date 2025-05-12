// src/routes/admin/+page.server.ts
import { db } from '$lib/server/db/index.js';
import { playerRole } from '$lib/server/db/schema/index.js';
import { hasPermission } from '$lib/utils/permissions';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
    if (!locals.player) {
        throw redirect(302, '/auth/login');
    }

    const hasAccess = await hasPermission(locals.player.id, 'view_admin');
    // if (!hasAccess) {
    //     throw redirect(302, '/');
    // }

    const roles = await db.select().from(playerRole).where(eq(playerRole.playerId, locals.player.id));

    return {
        player: locals.player,
        roles
    };
};
