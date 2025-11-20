import { db } from '$lib/server/db';
import { 
	playerStoryProgress, 
	character,
	characterItem,
	characterAttribute,
	attribute
} from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
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
		// Delete all character items (inventory)
		await db.delete(characterItem).where(eq(characterItem.characterId, userCharacter.id));

		// Reset character stats to starting values and mark onboarding as incomplete
		await db
			.update(character)
			.set({
				level: 1,
				xp: 0,
				gold: 0,
				hp: 100,
				maxHp: 100,
				attributePoints: 0,
				onboarding: false, // Send them back through onboarding
				updatedAt: new Date()
			})
			.where(eq(character.id, userCharacter.id));

		// Reset character attributes to base values
		const attributes = await db.select().from(attribute);
		
		// Update each attribute to its base value using composite key
		for (const attr of attributes) {
			await db
				.update(characterAttribute)
				.set({
					value: attr.baseValue || 5
				})
				.where(
					and(
						eq(characterAttribute.characterId, userCharacter.id),
						eq(characterAttribute.attributeId, attr.id)
					)
				);
		}
	}

	// Delete all story progress for this user
	await db.delete(playerStoryProgress).where(eq(playerStoryProgress.userId, userId));

	return json({ 
		success: true, 
		message: 'Story progress and character stats reset successfully' 
	});
};
