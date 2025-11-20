import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { 
	character, 
	playerStoryProgress, 
	encounter, 
	quest,
	choice 
} from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireSession } from '$lib/utils/requireSession';
import { checkLevelUp, getLevelUpRewards } from '$lib/utils/leveling';

/**
 * POST /api/game/make-choice
 * 
 * Handles player making a choice in an encounter.
 * - Records the choice
 * - Awards encounter rewards (XP, gold)
 * - Checks for level ups
 * - Advances to next encounter or quest
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const session = requireSession(locals);

	try {
		const { choiceId, encounterId } = await request.json();

		if (!choiceId || !encounterId) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Get the choice details
		const [selectedChoice] = await db
			.select()
			.from(choice)
			.where(eq(choice.id, choiceId))
			.limit(1);

		if (!selectedChoice) {
			return json({ error: 'Choice not found' }, { status: 404 });
		}

		// Get the encounter details (including rewards)
		const [currentEncounter] = await db
			.select()
			.from(encounter)
			.where(eq(encounter.id, encounterId))
			.limit(1);

		if (!currentEncounter) {
			return json({ error: 'Encounter not found' }, { status: 404 });
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

		// Award encounter rewards
		const newXp = currentCharacter.xp + (currentEncounter.xpReward || 0);
		const newGold = currentCharacter.gold + (currentEncounter.goldReward || 0);

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
			
			updateData.level = levelUpResult.newLevel;
			updateData.maxHp = currentCharacter.maxHp + rewards.maxHpIncrease;
			// Heal to full on level up
			updateData.hp = currentCharacter.maxHp + rewards.maxHpIncrease;
			// Add gold bonus
			updateData.gold = newGold + rewards.goldBonus;

			levelUpRewards = {
				newLevel: levelUpResult.newLevel,
				levelsGained: levelUpResult.levelsGained,
				attributePoints: rewards.attributePoints,
				maxHpIncrease: rewards.maxHpIncrease,
				goldBonus: rewards.goldBonus,
			};
		}

		// Update character with rewards
		const [updatedCharacter] = await db
			.update(character)
			.set(updateData)
			.where(eq(character.id, currentCharacter.id))
			.returning();

		// Find next encounter in the quest
		const [currentQuest] = await db
			.select()
			.from(quest)
			.where(eq(quest.id, currentEncounter.questId))
			.limit(1);

		// Get all encounters for this quest ordered by order
		const questEncounters = await db
			.select()
			.from(encounter)
			.where(and(
				eq(encounter.questId, currentEncounter.questId),
				eq(encounter.isActive, true)
			))
			.orderBy(encounter.order);

		// Find current encounter index
		const currentIndex = questEncounters.findIndex(e => e.id === encounterId);
		const nextEncounter = questEncounters[currentIndex + 1];

		let questComplete = false;
		let questRewards = null;

		// If no next encounter, quest is complete
		if (!nextEncounter && currentQuest) {
			questComplete = true;

			// Award quest rewards
			if (currentQuest.xpReward || currentQuest.goldReward) {
				const questXp = updatedCharacter.xp + (currentQuest.xpReward || 0);
				const questGold = updatedCharacter.gold + (currentQuest.goldReward || 0);

				const questLevelUp = checkLevelUp(questXp, updatedCharacter.level);

				let questUpdateData: {
					xp: number;
					gold: number;
					level?: number;
					maxHp?: number;
					hp?: number;
				} = {
					xp: questXp,
					gold: questGold,
				};

				if (questLevelUp.canLevelUp && !levelUpRewards) {
					const rewards = getLevelUpRewards(questLevelUp.levelsGained);
					
					questUpdateData.level = questLevelUp.newLevel;
					questUpdateData.maxHp = updatedCharacter.maxHp + rewards.maxHpIncrease;
					questUpdateData.hp = updatedCharacter.maxHp + rewards.maxHpIncrease;
					questUpdateData.gold = questGold + rewards.goldBonus;

					levelUpRewards = {
						newLevel: questLevelUp.newLevel,
						levelsGained: questLevelUp.levelsGained,
						attributePoints: rewards.attributePoints,
						maxHpIncrease: rewards.maxHpIncrease,
						goldBonus: rewards.goldBonus,
					};
				}

				await db
					.update(character)
					.set(questUpdateData)
					.where(eq(character.id, currentCharacter.id));

				questRewards = {
					xpGained: currentQuest.xpReward,
					goldGained: currentQuest.goldReward,
				};
			}
		}

		// Update story progress to next encounter (or mark quest complete)
		await db
			.update(playerStoryProgress)
			.set({
				encounterId: nextEncounter?.id || null,
				questId: questComplete ? null : currentEncounter.questId,
				updatedAt: new Date(),
			})
			.where(eq(playerStoryProgress.userId, session.user.id));

		return json({
			success: true,
			choice: selectedChoice,
			outcome: selectedChoice.outcome,
			rewards: {
				xpGained: currentEncounter.xpReward || 0,
				goldGained: currentEncounter.goldReward || 0,
			},
			questRewards,
			levelUp: levelUpRewards,
			nextEncounter: nextEncounter || null,
			questComplete,
		});
	} catch (error) {
		console.error('Error making choice:', error);
		return json({ error: 'Failed to process choice' }, { status: 500 });
	}
};
