import { db } from '$lib/server/db';
import { 
	playerStoryProgress, 
	character,
	characterItem,
	characterAttribute,
	characterFaction
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

	// Get the user's character
	const [userCharacter] = await db
		.select()
		.from(character)
		.where(eq(character.userId, userId))
		.limit(1);

	if (userCharacter) {
		console.log('[RESET] Before reset - Character:', {
			id: userCharacter.id,
			name: userCharacter.name,
			level: userCharacter.level,
			xp: userCharacter.xp,
			gold: userCharacter.gold
		});

		// Delete all character items (inventory)
		await db.delete(characterItem).where(eq(characterItem.characterId, userCharacter.id));

		// Delete faction relationship so player can choose again during onboarding
		await db.delete(characterFaction).where(eq(characterFaction.characterId, userCharacter.id));

		// Reset character stats to starting values and mark onboarding as incomplete
		const [resetCharacter] = await db
			.update(character)
			.set({
				level: 1,
				xp: 0,
				gold: 0,
				hp: 100,
				maxHp: 100,
				onboarding: false, // Send them back through onboarding
				updatedAt: new Date()
			})
			.where(eq(character.id, userCharacter.id))
			.returning();

		console.log('[RESET] After reset - Character:', {
			id: resetCharacter.id,
			name: resetCharacter.name,
			level: resetCharacter.level,
			xp: resetCharacter.xp,
			gold: resetCharacter.gold
		});

		// Delete all character attributes to ensure clean state
		await db.delete(characterAttribute).where(eq(characterAttribute.characterId, userCharacter.id));

		console.log('[RESET] Deleted all character attributes for fresh reset');
	}

	// Delete all story progress for this user
	await db.delete(playerStoryProgress).where(eq(playerStoryProgress.userId, userId));

	return json({ 
		success: true, 
		message: 'Story progress and character stats reset successfully' 
	});
};
