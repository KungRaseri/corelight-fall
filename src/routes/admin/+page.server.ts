// src/routes/admin/+page.server.ts
import { hasPermission } from '$lib/utils/permissions';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    return {
        player: locals.player
    };
};
