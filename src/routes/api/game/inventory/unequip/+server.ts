import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { characterEquipment } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireSession } from '$lib/utils/requireSession';

export async function POST({ request, locals }) {
    requireSession(locals);

    const { characterId, slot } = await request.json();
    if (!slot) {
        return json({ error: 'Invalid data' }, { status: 400 });
    }

    try {
        // Remove the item from the specified slot
        await db.delete(characterEquipment)
            .where(eq(characterEquipment.characterId, characterId) && eq(characterEquipment.slot, slot));

        return json({ success: true });
    } catch (error) {
        console.error('Error unequipping item:', error);
        return json({ error: 'Failed to unequip item' }, { status: 500 });
    }
}
