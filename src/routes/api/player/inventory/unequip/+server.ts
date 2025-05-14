import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { playerEquipment, playerItem } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request, locals }) {
    if (!locals.player) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slot } = await request.json();
    if (!slot) {
        return json({ error: 'Invalid data' }, { status: 400 });
    }

    try {
        // Remove the item from the specified slot
        await db.delete(playerEquipment)
            .where(eq(playerEquipment.playerId, locals.player.id) && eq(playerEquipment.slot, slot));

        return json({ success: true });
    } catch (error) {
        console.error('Error unequipping item:', error);
        return json({ error: 'Failed to unequip item' }, { status: 500 });
    }
}
