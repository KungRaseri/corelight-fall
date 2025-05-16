import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { characterEquipment } from '$lib/server/db/schema';

export async function POST({ request, locals }) {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { characterId, itemId, slot } = await request.json();

    console.log(itemId, slot);
    if (!itemId || !slot) {
        return json({ error: 'Invalid data' }, { status: 400 });
    }

    try {
        // Update the character's equipment slot
        await db.insert(characterEquipment).values({
            characterId: characterId,
            itemId,
            slot,
        }).onConflictDoNothing();

        return json({ success: true });
    } catch (error) {
        console.error('Error equipping item:', error);
        return json({ error: 'Failed to equip item' }, { status: 500 });
    }
}
