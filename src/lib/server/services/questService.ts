import { db } from '../db';
import {
	quest,
	questObjective,
	characterQuestState,
	storyFlag,
	character
} from '../db/schema';
import { eq, and, inArray } from 'drizzle-orm';

/**
 * Quest Service - Manages quest states, prerequisites, objectives, and completion
 */

export interface QuestPrerequisite {
	questsCompleted?: number[];
	flagsRequired?: { name: string; value: boolean | number | string }[];
	minLevel?: number;
	pathRequired?: string;
	actNumber?: number;
}

export class QuestService {
	/**
	 * Get all quests for a character with their current state
	 */
	async getCharacterQuests(characterId: number) {
		const quests = await db
			.select()
			.from(quest)
			.leftJoin(
				characterQuestState,
				and(
					eq(characterQuestState.questId, quest.id),
					eq(characterQuestState.characterId, characterId)
				)
			)
			.where(eq(quest.isActive, true));

		return quests;
	}

	/**
	 * Get a specific quest with its objectives and character state
	 */
	async getQuestDetails(questId: number, characterId: number) {
		const [questData] = await db
			.select()
			.from(quest)
			.leftJoin(
				characterQuestState,
				and(
					eq(characterQuestState.questId, questId),
					eq(characterQuestState.characterId, characterId)
				)
			)
			.where(eq(quest.id, questId));

		if (!questData) {
			throw new Error(`Quest ${questId} not found`);
		}

		// Get objectives
		const objectives = await db
			.select()
			.from(questObjective)
			.where(eq(questObjective.questId, questId))
			.orderBy(questObjective.order);

		return {
			quest: questData.quest,
			state: questData.character_quest_state,
			objectives
		};
	}

	/**
	 * Check if a quest's prerequisites are met for a character
	 */
	async checkPrerequisites(
		characterId: number,
		prerequisites: QuestPrerequisite
	): Promise<{ met: boolean; missing: string[] }> {
		const missing: string[] = [];

		// Check completed quests
		if (prerequisites.questsCompleted && prerequisites.questsCompleted.length > 0) {
			const completedQuests = await db
				.select()
				.from(characterQuestState)
				.where(
					and(
						eq(characterQuestState.characterId, characterId),
						eq(characterQuestState.status, 'completed'),
						inArray(characterQuestState.questId, prerequisites.questsCompleted)
					)
				);

			const completedQuestIds = new Set(completedQuests.map((q) => q.questId));
			const missingQuests = prerequisites.questsCompleted.filter(
				(id) => !completedQuestIds.has(id)
			);

			if (missingQuests.length > 0) {
				missing.push(`Missing completed quests: ${missingQuests.join(', ')}`);
			}
		}

		// Check required flags
		if (prerequisites.flagsRequired && prerequisites.flagsRequired.length > 0) {
			for (const flagReq of prerequisites.flagsRequired) {
				const [flag] = await db
					.select()
					.from(storyFlag)
					.where(
						and(
							eq(storyFlag.characterId, characterId),
							eq(storyFlag.flagName, flagReq.name)
						)
					);

				if (!flag) {
					missing.push(`Missing flag: ${flagReq.name}`);
					continue;
				}

				// Check flag value based on type
				let valueMatches = false;
				if (flag.flagType === 'boolean' && typeof flagReq.value === 'boolean') {
					valueMatches = flag.booleanValue === flagReq.value;
				} else if (flag.flagType === 'integer' && typeof flagReq.value === 'number') {
					valueMatches = flag.integerValue === flagReq.value;
				} else if (flag.flagType === 'text' && typeof flagReq.value === 'string') {
					valueMatches = flag.textValue === flagReq.value;
				}

				if (!valueMatches) {
					missing.push(`Flag ${flagReq.name} has wrong value`);
				}
			}
		}

		// Check character level
		if (prerequisites.minLevel) {
			const [char] = await db
				.select()
				.from(character)
				.where(eq(character.id, characterId));

			if (!char || char.level < prerequisites.minLevel) {
				missing.push(`Level ${prerequisites.minLevel} required`);
			}
		}

		return {
			met: missing.length === 0,
			missing
		};
	}

	/**
	 * Start a quest for a character
	 */
	async startQuest(characterId: number, questId: number) {
		// Check if quest exists and is active
		const [questData] = await db.select().from(quest).where(eq(quest.id, questId));

		if (!questData?.isActive) {
			throw new Error('Quest not found or inactive');
		}

		// Check if already started
		const [existingState] = await db
			.select()
			.from(characterQuestState)
			.where(
				and(
					eq(characterQuestState.characterId, characterId),
					eq(characterQuestState.questId, questId)
				)
			);

		if (existingState) {
			if (existingState.status === 'active') {
				throw new Error('Quest already active');
			}
			if (existingState.status === 'completed') {
				throw new Error('Quest already completed');
			}
		}

		// Create or update quest state
		const [newState] = await db
			.insert(characterQuestState)
			.values({
				characterId,
				questId,
				status: 'active',
				startedAt: new Date(),
				objectivesCompleted: [],
				choicesMade: [],
				timesAttempted: (existingState?.timesAttempted || 0) + 1
			})
			.returning();

		return newState;
	}

	/**
	 * Complete a quest objective
	 */
	async completeObjective(characterId: number, questId: number, objectiveId: number) {
		const [state] = await db
			.select()
			.from(characterQuestState)
			.where(
				and(
					eq(characterQuestState.characterId, characterId),
					eq(characterQuestState.questId, questId)
				)
			);

		if (!state) {
			throw new Error('Quest not started');
		}

		if (state.status !== 'active') {
			throw new Error('Quest not active');
		}

		// Check if objective belongs to this quest
		const [objective] = await db
			.select()
			.from(questObjective)
			.where(
				and(
					eq(questObjective.id, objectiveId),
					eq(questObjective.questId, questId)
				)
			);

		if (!objective) {
			throw new Error('Objective not found for this quest');
		}

		// Add to completed objectives
		const completed = state.objectivesCompleted as number[];
		if (!completed.includes(objectiveId)) {
			completed.push(objectiveId);

			await db
				.update(characterQuestState)
				.set({
					objectivesCompleted: completed,
					updatedAt: new Date()
				})
				.where(eq(characterQuestState.id, state.id));
		}

		// Check if all required objectives are complete
		await this.checkQuestCompletion(characterId, questId);

		return { success: true, objectiveId };
	}

	/**
	 * Check if all quest objectives are complete and complete the quest if so
	 */
	async checkQuestCompletion(characterId: number, questId: number) {
		const [state] = await db
			.select()
			.from(characterQuestState)
			.where(
				and(
					eq(characterQuestState.characterId, characterId),
					eq(characterQuestState.questId, questId)
				)
			);

		if (state?.status !== 'active') {
			return false;
		}

		// Get all required objectives (non-optional)
		const objectives = await db
			.select()
			.from(questObjective)
			.where(
				and(
					eq(questObjective.questId, questId),
					eq(questObjective.isOptional, false)
				)
			);

		const completed = state.objectivesCompleted as number[];
		const allComplete = objectives.every((obj) => completed.includes(obj.id));

		if (allComplete) {
			await this.completeQuest(characterId, questId);
			return true;
		}

		return false;
	}

	/**
	 * Complete a quest
	 */
	async completeQuest(characterId: number, questId: number) {
		const [questData] = await db.select().from(quest).where(eq(quest.id, questId));

		if (!questData) {
			throw new Error('Quest not found');
		}

		await db
			.update(characterQuestState)
			.set({
				status: 'completed',
				completedAt: new Date(),
				updatedAt: new Date()
			})
			.where(
				and(
					eq(characterQuestState.characterId, characterId),
					eq(characterQuestState.questId, questId)
				)
			);

		// Award XP and gold
		if (questData.xpReward || questData.goldReward) {
			await this.awardQuestRewards(characterId, questData.xpReward, questData.goldReward);
		}

		return { success: true, xp: questData.xpReward, gold: questData.goldReward };
	}

	/**
	 * Fail a quest
	 */
	async failQuest(characterId: number, questId: number, reason?: string) {
		await db
			.update(characterQuestState)
			.set({
				status: 'failed',
				failedAt: new Date(),
				updatedAt: new Date()
			})
			.where(
				and(
					eq(characterQuestState.characterId, characterId),
					eq(characterQuestState.questId, questId)
				)
			);

		return { success: true, reason };
	}

	/**
	 * Award quest rewards to character
	 */
	private async awardQuestRewards(characterId: number, xp: number, gold: number) {
		const [char] = await db
			.select()
			.from(character)
			.where(eq(character.id, characterId));

		if (!char) {
			throw new Error('Character not found');
		}

		await db
			.update(character)
			.set({
				xp: char.xp + xp,
				gold: char.gold + gold
			})
			.where(eq(character.id, characterId));
	}

	/**
	 * Record a choice made during a quest
	 */
	async recordQuestChoice(
		characterId: number,
		questId: number,
		encounterId: number,
		choiceId: number,
		outcome: string
	) {
		const [state] = await db
			.select()
			.from(characterQuestState)
			.where(
				and(
					eq(characterQuestState.characterId, characterId),
					eq(characterQuestState.questId, questId)
				)
			);

		if (!state) {
			throw new Error('Quest not started');
		}

		const choices = state.choicesMade as {
			encounterId: number;
			choiceId: number;
			timestamp: string;
			outcome: string;
		}[];

		choices.push({
			encounterId,
			choiceId,
			timestamp: new Date().toISOString(),
			outcome
		});

		await db
			.update(characterQuestState)
			.set({
				choicesMade: choices,
				updatedAt: new Date()
			})
			.where(eq(characterQuestState.id, state.id));

		return { success: true };
	}
}

export const questService = new QuestService();
