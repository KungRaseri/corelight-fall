import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { character } from '$lib/server/db/schema/gameplay/character';
import { eq } from 'drizzle-orm';
import { requireSession } from '$lib/utils/requireSession';
import { checkLevelUp, getLevelUpRewards } from '$lib/utils/leveling';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = requireSession(locals);

	try {
		const { xpGained, goldGained, source } = await request.json();

		if (typeof xpGained !== 'number' || xpGained < 0) {
			return json({ error: 'Invalid XP amount' }, { status: 400 });
		}

		if (typeof goldGained !== 'number' || goldGained < 0) {
			return json({ error: 'Invalid gold amount' }, { status: 400 });
		}

		// Get current character
		const [currentCharacter] = await db
			.select()
			.from(character)
			.where(eq(character.userId, session.user.id))
			.limit(1);

		if (!currentCharacter) {
			return json({ error: 'Character not found' }, { status: 404 });
		}

		// Calculate new XP and gold
		const newXp = currentCharacter.xp + xpGained;
		const newGold = currentCharacter.gold + goldGained;

		// Check for level up
		const levelUpResult = checkLevelUp(newXp, currentCharacter.level);

		let updateData: {
			xp: number;
			gold: number;
			level?: number;
			maxHp?: number;
			hp?: number;
		} = {
			xp: newXp,
			gold: newGold,
		};

		let levelUpRewards = null;

	if (levelUpResult.canLevelUp) {
		const rewards = getLevelUpRewards(levelUpResult.levelsGained);
		
		const newMaxHp = currentCharacter.maxHp + rewards.maxHpIncrease;
		
		updateData.level = levelUpResult.newLevel;
		updateData.maxHp = newMaxHp;
		// Heal to full on level up (set HP to the new max HP)
		updateData.hp = newMaxHp;
		// Add gold bonus
		updateData.gold = newGold + rewards.goldBonus;

		levelUpRewards = {
			newLevel: levelUpResult.newLevel,
			levelsGained: levelUpResult.levelsGained,
			attributePoints: rewards.attributePoints,
			maxHpIncrease: rewards.maxHpIncrease,
			goldBonus: rewards.goldBonus,
		};
	}		// Update character
		const [updatedCharacter] = await db
			.update(character)
			.set(updateData)
			.where(eq(character.id, currentCharacter.id))
			.returning();

		return json({
			success: true,
			character: updatedCharacter,
			rewards: {
				xpGained,
				goldGained,
				source,
			},
			levelUp: levelUpRewards,
		});
	} catch (error) {
		console.error('Error awarding rewards:', error);
		return json({ error: 'Failed to award rewards' }, { status: 500 });
	}
};
