// src/routes/admin/+page.server.ts
import { db } from '$lib/server/db/index';
import { userRole } from '$lib/server/db/schema';
import { hasPermission, hasRole } from '$lib/utils/permissions';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
    if (!locals.user || !locals.role) {
        throw redirect(302, '/auth/login');
    }

    const hasAccess = await hasRole(locals.role, 'admin');
    if (!hasAccess && locals.user.id !== 1) {
        throw redirect(302, '/');
    }

    const roles = await db.select().from(userRole).where(eq(userRole.userId, locals.user.id));

    return {
        user: locals.user,
        roles
    };
};
