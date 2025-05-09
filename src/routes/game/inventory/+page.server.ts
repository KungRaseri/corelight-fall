import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { playerItem, item } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.player) {
        return { status: 401, error: new Error('Unauthorized') };
    }

    // Fetch the player's inventory with item details
    const inventory = await db.select({
        playerId: playerItem.playerId,
        itemId: playerItem.itemId,
        quantity: playerItem.quantity,
        name: item.name,
        type: item.type,
        description: item.description
    })
    .from(playerItem)
    .innerJoin(item, eq(playerItem.itemId, item.id))
    .where(eq(playerItem.playerId, locals.player.id));

    return { inventory };
};
