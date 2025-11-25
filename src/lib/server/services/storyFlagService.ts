import { db } from '../db';
import { storyFlag } from '../db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Story Flag Service - Manages story flags/variables for narrative branching
 */

export type FlagValue = boolean | number | string;
export type FlagType = 'boolean' | 'integer' | 'text';

export class StoryFlagService {
	/**
	 * Determine flag type from value
	 */
	private getFlagType(value: FlagValue): FlagType {
		if (typeof value === 'boolean') return 'boolean';
		if (typeof value === 'number') return 'integer';
		return 'text';
	}

	/**
	 * Get a flag value for a character
	 */
	async getFlag(characterId: number, flagName: string): Promise<FlagValue | null> {
		const [flag] = await db
			.select()
			.from(storyFlag)
			.where(
				and(
					eq(storyFlag.characterId, characterId),
					eq(storyFlag.flagName, flagName)
				)
			);

		if (!flag) return null;

		switch (flag.flagType) {
			case 'boolean':
				return flag.booleanValue;
			case 'integer':
				return flag.integerValue;
			case 'text':
				return flag.textValue;
			default:
				return null;
		}
	}

	/**
	 * Set a flag value for a character
	 */
	async setFlag(
		characterId: number,
		flagName: string,
		value: FlagValue,
		options?: {
			category?: string;
			description?: string;
			questId?: number;
			encounterId?: number;
			choiceId?: number;
			isPermanent?: boolean;
		}
	) {
		const flagType = this.getFlagType(value);

		// Check if flag already exists
		const [existing] = await db
			.select()
			.from(storyFlag)
			.where(
				and(
					eq(storyFlag.characterId, characterId),
					eq(storyFlag.flagName, flagName)
				)
			);

		if (existing) {
			return await this.updateExistingFlag(existing, value, flagType);
		} else {
			return await this.createNewFlag(characterId, flagName, value, flagType, options);
		}
	}

	/**
	 * Update an existing flag
	 */
	private async updateExistingFlag(
		existing: typeof storyFlag.$inferSelect,
		value: FlagValue,
		flagType: FlagType
	) {
		// Can't update permanent flags
		if (existing.isPermanent) {
			throw new Error(`Flag ${existing.flagName} is permanent and cannot be changed`);
		}

		await db
			.update(storyFlag)
			.set({
				flagType,
				booleanValue: typeof value === 'boolean' ? value : null,
				integerValue: typeof value === 'number' ? value : null,
				textValue: typeof value === 'string' ? value : null,
				updatedAt: new Date()
			})
			.where(eq(storyFlag.id, existing.id));

		return { flagName: existing.flagName, value };
	}

	/**
	 * Create a new flag
	 */
	private async createNewFlag(
		characterId: number,
		flagName: string,
		value: FlagValue,
		flagType: FlagType,
		options?: {
			category?: string;
			description?: string;
			questId?: number;
			encounterId?: number;
			choiceId?: number;
			isPermanent?: boolean;
		}
	) {
		await db
			.insert(storyFlag)
			.values({
				characterId,
				flagName,
				category: options?.category,
				flagType,
				booleanValue: typeof value === 'boolean' ? value : null,
				integerValue: typeof value === 'number' ? value : null,
				textValue: typeof value === 'string' ? value : null,
				description: options?.description,
				setByQuestId: options?.questId,
				setByEncounterId: options?.encounterId,
				setByChoiceId: options?.choiceId,
				isPermanent: options?.isPermanent || false,
				setAt: new Date()
			});

		return { flagName, value };
	}

	/**
	 * Check if a flag exists and has a specific value
	 */
	async checkFlag(characterId: number, flagName: string, expectedValue: FlagValue): Promise<boolean> {
		const value = await this.getFlag(characterId, flagName);
		return value === expectedValue;
	}

	/**
	 * Get the actual value from a flag based on its type
	 */
	private getFlagValue(flag: typeof storyFlag.$inferSelect): FlagValue | null {
		if (flag.flagType === 'boolean') return flag.booleanValue;
		if (flag.flagType === 'integer') return flag.integerValue;
		if (flag.flagType === 'text') return flag.textValue;
		return null;
	}

	/**
	 * Get all flags for a character
	 */
	async getAllFlags(characterId: number) {
		const flags = await db
			.select()
			.from(storyFlag)
			.where(eq(storyFlag.characterId, characterId));

		return flags.map(flag => ({
			name: flag.flagName,
			value: this.getFlagValue(flag),
			type: flag.flagType,
			category: flag.category,
			isPermanent: flag.isPermanent
		}));
	}

	/**
	 * Delete a flag (if not permanent)
	 */
	async deleteFlag(characterId: number, flagName: string) {
		const [flag] = await db
			.select()
			.from(storyFlag)
			.where(
				and(
					eq(storyFlag.characterId, characterId),
					eq(storyFlag.flagName, flagName)
				)
			);

		if (!flag) {
			throw new Error('Flag not found');
		}

		if (flag.isPermanent) {
			throw new Error('Cannot delete permanent flag');
		}

		await db
			.delete(storyFlag)
			.where(eq(storyFlag.id, flag.id));

		return { success: true };
	}
}

export const storyFlagService = new StoryFlagService();
