import { db } from '../db';
import { 
	characterNpcRelationship, 
	characterFaction, 
	npc 
} from '../db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Relationship Service - Manages NPC relationships and faction reputation
 */

export class RelationshipService {
	/**
	 * Get relationship with a specific NPC
	 */
	async getNpcRelationship(characterId: number, npcId: number) {
		const [relationship] = await db
			.select()
			.from(characterNpcRelationship)
			.where(
				and(
					eq(characterNpcRelationship.characterId, characterId),
					eq(characterNpcRelationship.npcId, npcId)
				)
			);

		return relationship || null;
	}

	/**
	 * Get all NPC relationships for a character
	 */
	async getAllNpcRelationships(characterId: number) {
		return await db
			.select({
				relationship: characterNpcRelationship,
				npc: npc
			})
			.from(characterNpcRelationship)
			.innerJoin(npc, eq(characterNpcRelationship.npcId, npc.id))
			.where(eq(characterNpcRelationship.characterId, characterId));
	}

	/**
	 * Update relationship level with an NPC
	 */
	async updateNpcRelationship(
		characterId: number,
		npcId: number,
		levelChange: number
	) {
		const existing = await this.getNpcRelationship(characterId, npcId);

		if (existing) {
			const currentLevel = existing.relationshipLevel ?? 0;
			const currentInteractions = existing.totalInteractions ?? 0;
			const newLevel = Math.max(-100, Math.min(100, currentLevel + levelChange));
			const newInteractions = currentInteractions + 1;

			await db
				.update(characterNpcRelationship)
				.set({
					relationshipLevel: newLevel,
					totalInteractions: newInteractions,
					lastInteractionAt: new Date()
				})
				.where(eq(characterNpcRelationship.id, existing.id));

			return { 
				npcId, 
				previousLevel: currentLevel, 
				newLevel,
				change: levelChange 
			};
		} else {
			// Create new relationship
			const initialLevel = Math.max(-100, Math.min(100, levelChange));

			await db
				.insert(characterNpcRelationship)
				.values({
					characterId,
					npcId,
					relationshipLevel: initialLevel,
					totalInteractions: 1,
					hasMetBefore: true,
					firstMeetingAt: new Date(),
					lastInteractionAt: new Date()
				});

			return { 
				npcId, 
				previousLevel: 0, 
				newLevel: initialLevel,
				change: levelChange 
			};
		}
	}

	/**
	 * Get faction reputation
	 */
	async getFactionReputation(characterId: number, factionId: number) {
		const [reputation] = await db
			.select()
			.from(characterFaction)
			.where(
				and(
					eq(characterFaction.characterId, characterId),
					eq(characterFaction.factionId, factionId)
				)
			);

		return reputation || null;
	}

	/**
	 * Update faction reputation
	 */
	async updateFactionReputation(
		characterId: number,
		factionId: number,
		reputationChange: number
	) {
		const existing = await this.getFactionReputation(characterId, factionId);

		if (existing) {
			const currentReputation = existing.reputation ?? 0;
			const newReputation = Math.max(-100, Math.min(100, currentReputation + reputationChange));

			await db
				.update(characterFaction)
				.set({
					reputation: newReputation
				})
				.where(eq(characterFaction.id, existing.id));

			return {
				factionId,
				previousReputation: currentReputation,
				newReputation,
				change: reputationChange
			};
		} else {
			// Create new faction relationship
			const initialReputation = Math.max(-100, Math.min(100, reputationChange));

			await db
				.insert(characterFaction)
				.values({
					characterId,
					factionId,
					reputation: initialReputation
				});

			return {
				factionId,
				previousReputation: 0,
				newReputation: initialReputation,
				change: reputationChange
			};
		}
	}

	/**
	 * Get relationship status based on level
	 */
	getRelationshipStatus(level: number): string {
		if (level >= 80) return 'Devoted';
		if (level >= 60) return 'Trusted';
		if (level >= 40) return 'Friendly';
		if (level >= 20) return 'Acquaintance';
		if (level >= 0) return 'Neutral';
		if (level >= -20) return 'Wary';
		if (level >= -40) return 'Unfriendly';
		if (level >= -60) return 'Hostile';
		return 'Enemies';
	}

	/**
	 * Check if relationship meets minimum level requirement
	 */
	async checkRelationshipRequirement(
		characterId: number,
		npcId: number,
		minLevel: number
	): Promise<boolean> {
		const relationship = await this.getNpcRelationship(characterId, npcId);
		
		if (!relationship) {
			return minLevel <= 0;
		}

		const currentLevel = relationship.relationshipLevel ?? 0;
		return currentLevel >= minLevel;
	}
}

export const relationshipService = new RelationshipService();
