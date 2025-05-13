import { db } from '$lib/server/db';
import { player, playerRole, role } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        const players = await db
            .select({
                id: player.id,
                username: player.username,
                createdAt: player.createdAt,
                roleName: role.name
            })
            .from(player)
            .leftJoin(playerRole, eq(playerRole.playerId, player.id))
            .leftJoin(role, eq(playerRole.roleId, role.id))

        return { players };
    } catch (error) {
        console.error('Error loading players:', error);
        return { players: [] };
    }
};
