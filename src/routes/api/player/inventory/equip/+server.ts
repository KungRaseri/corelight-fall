import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { playerEquipment } from '$lib/server/db/schema';

export async function POST({ request, locals }) {
    if (!locals.player) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId, slot } = await request.json();

    console.log(itemId, slot);
    if (!itemId || !slot) {
        return json({ error: 'Invalid data' }, { status: 400 });
    }

    try {
        // Update the player's equipment slot
        await db.insert(playerEquipment).values({
            playerId: locals.player.id,
            itemId,
            slot,
        }).onConflictDoNothing();

        return json({ success: true });
    } catch (error) {
        console.error('Error equipping item:', error);
        return json({ error: 'Failed to equip item' }, { status: 500 });
    }
}
