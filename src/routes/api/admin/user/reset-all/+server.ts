import { db } from '$lib/server/db';
import { 
	character, 
	characterAttribute, 
	characterItem, 
	characterFaction, 
	characterEquipment,
	playerStoryProgress
} from '$lib/server/db/schema';
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

	// Delete story progress
	await db.delete(playerStoryProgress).where(eq(playerStoryProgress.userId, userId));

	// If character exists, delete all character data
	if (characterData) {
		await Promise.all([
			db.delete(characterAttribute).where(eq(characterAttribute.characterId, characterData.id)),
			db.delete(characterItem).where(eq(characterItem.characterId, characterData.id)),
			db.delete(characterFaction).where(eq(characterFaction.characterId, characterData.id)),
			db.delete(characterEquipment).where(eq(characterEquipment.characterId, characterData.id))
		]);

		await db.delete(character).where(eq(character.id, characterData.id));
	}

	return json({ success: true, message: 'User game data reset successfully. User will need to complete onboarding again.' });
};
