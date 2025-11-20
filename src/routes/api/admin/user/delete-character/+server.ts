import { db } from '$lib/server/db';
import { character, characterAttribute, characterItem, characterFaction, characterEquipment } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/utils/requireAdmin';

export const POST: RequestHandler = async ({ locals, request }) => {
	await requireAdmin(locals);

	const { userId } = await request.json();

	if (!userId || typeof userId !== 'number') {
		error(400, 'Invalid user ID');
	}

	// Get character ID first
	const characterData = (
		await db.select().from(character).where(eq(character.userId, userId))
	)[0];

	if (!characterData) {
		return json({ success: false, message: 'No character found for this user' });
	}

	// Delete all character-related data
	await Promise.all([
		db.delete(characterAttribute).where(eq(characterAttribute.characterId, characterData.id)),
		db.delete(characterItem).where(eq(characterItem.characterId, characterData.id)),
		db.delete(characterFaction).where(eq(characterFaction.characterId, characterData.id)),
		db.delete(characterEquipment).where(eq(characterEquipment.characterId, characterData.id))
	]);

	// Finally delete the character
	await db.delete(character).where(eq(character.id, characterData.id));

	return json({ success: true, message: 'Character deleted successfully' });
};
