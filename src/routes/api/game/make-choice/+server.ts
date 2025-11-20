import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { 
	character,
	characterAttribute,
	attribute,
	playerStoryProgress, 
	encounter, 
	quest,
	choice 
} from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireSession } from '$lib/utils/requireSession';
import { checkLevelUp, getLevelUpRewards } from '$lib/utils/leveling';
import { performSkillCheck, formatSkillCheckResult } from '$lib/utils/skillCheck';

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
	await requireSession(locals);

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
			console.error('Encounter not found:', encounterId);
			return json({ error: 'Encounter not found' }, { status: 404 });
		}

		if (!currentEncounter.questId) {
			console.error('Encounter has no questId:', currentEncounter);
			return json({ error: 'Encounter has no associated quest' }, { status: 400 });
		}

		// Get current character
		const [currentCharacter] = await db
			.select()
			.from(character)
			.where(eq(character.userId, locals.user!.id))
			.limit(1);

		if (!currentCharacter) {
			return json({ error: 'Character not found' }, { status: 404 });
		}

		// Perform skill check if required
		let skillCheckResult = null;
		let actualOutcome = selectedChoice.outcome;
		let actualXpReward = selectedChoice.xpReward || 0;
		let actualGoldReward = selectedChoice.goldReward || 0;
		let actualNextEncounterId = selectedChoice.nextEncounterId;

	if (selectedChoice.requiresCheck) {
		// Validate character and choice data
		if (!currentCharacter?.id) {
			console.error('Invalid character:', currentCharacter);
			return json({ error: 'Invalid character data' }, { status: 400 });
		}

		if (!selectedChoice.requiresCheck) {
			console.error('Invalid requiresCheck:', selectedChoice);
			return json({ error: 'Invalid skill check configuration' }, { status: 400 });
		}

		// Get character's attribute value for the check
		const [charAttr] = await db
			.select({
				value: characterAttribute.value,
				name: attribute.name
			})
			.from(characterAttribute)
			.innerJoin(attribute, eq(characterAttribute.attributeId, attribute.id))
			.where(and(
				eq(characterAttribute.characterId, currentCharacter.id),
				eq(attribute.name, selectedChoice.requiresCheck)
			))
			.limit(1);

		if (!charAttr) {
			console.error(`Attribute ${selectedChoice.requiresCheck} not found for character ${currentCharacter.id}`);
			console.error('Character:', currentCharacter);
			console.error('Choice:', selectedChoice);
			return json({ error: `Attribute ${selectedChoice.requiresCheck} not found for character` }, { status: 400 });
		}			// Perform the skill check
			skillCheckResult = performSkillCheck(
				charAttr.value,
				selectedChoice.checkDifficulty || 10
			);

			// If failed, use failure outcomes
			if (!skillCheckResult.success) {
				actualOutcome = selectedChoice.failureOutcome || selectedChoice.outcome;
				actualXpReward = selectedChoice.failureXpReward || 0;
				actualGoldReward = selectedChoice.failureGoldReward || 0;
				actualNextEncounterId = selectedChoice.failureNextEncounterId || selectedChoice.nextEncounterId;
			}

			// Format check result for display
			skillCheckResult.formattedResult = formatSkillCheckResult(skillCheckResult, charAttr.name);
		}

		// Award encounter rewards
		const newXp = currentCharacter.xp + (currentEncounter.xpReward || 0);
		const newGold = currentCharacter.gold + (currentEncounter.goldReward || 0);

		// Add choice-specific rewards (using actual rewards based on success/failure)
		const totalXp = newXp + actualXpReward;
		const totalGold = newGold + actualGoldReward;

		// Check for level up
		const levelUpResult = checkLevelUp(totalXp, currentCharacter.level);

		let updateData: {
			xp: number;
			gold: number;
			level?: number;
			maxHp?: number;
			hp?: number;
		} = {
			xp: totalXp,
			gold: totalGold,
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
		updateData.gold = totalGold + rewards.goldBonus;

		levelUpRewards = {
			newLevel: levelUpResult.newLevel,
			levelsGained: levelUpResult.levelsGained,
			attributePoints: rewards.attributePoints,
			maxHpIncrease: rewards.maxHpIncrease,
			goldBonus: rewards.goldBonus,
		};
	}		// Update character with rewards
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

		if (!currentQuest) {
			return json({ error: 'Quest not found' }, { status: 404 });
		}

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
				
				const questNewMaxHp = updatedCharacter.maxHp + rewards.maxHpIncrease;
				
				questUpdateData.level = questLevelUp.newLevel;
				questUpdateData.maxHp = questNewMaxHp;
				questUpdateData.hp = questNewMaxHp;
				questUpdateData.gold = questGold + rewards.goldBonus;

				levelUpRewards = {
					newLevel: questLevelUp.newLevel,
					levelsGained: questLevelUp.levelsGained,
					attributePoints: rewards.attributePoints,
					maxHpIncrease: rewards.maxHpIncrease,
					goldBonus: rewards.goldBonus,
				};
			}				await db
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
		// Use actualNextEncounterId which may be different on failure
		const progressNextEncounter = actualNextEncounterId 
			? questEncounters.find(e => e.id === actualNextEncounterId) || nextEncounter
			: nextEncounter;

		await db
			.update(playerStoryProgress)
			.set({
				encounterId: progressNextEncounter?.id || null,
				questId: questComplete ? null : currentEncounter.questId,
				updatedAt: new Date(),
			})
			.where(eq(playerStoryProgress.userId, locals.user!.id));

		return json({
			success: true,
			choice: selectedChoice,
			outcome: actualOutcome,
			skillCheck: skillCheckResult,
			character: updatedCharacter,
			rewards: {
				xpGained: (currentEncounter.xpReward || 0) + actualXpReward,
				goldGained: (currentEncounter.goldReward || 0) + actualGoldReward,
				encounterXp: currentEncounter.xpReward || 0,
				encounterGold: currentEncounter.goldReward || 0,
				choiceXp: actualXpReward,
				choiceGold: actualGoldReward,
			},
			questRewards,
			levelUp: levelUpRewards,
			nextEncounter: progressNextEncounter || null,
			questComplete,
		});
	} catch (error) {
		console.error('Error making choice:', error);
		return json({ error: 'Failed to process choice' }, { status: 500 });
	}
};
