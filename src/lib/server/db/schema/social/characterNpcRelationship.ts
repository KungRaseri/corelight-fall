import { pgTable, serial, integer, timestamp, jsonb, text, boolean } from 'drizzle-orm/pg-core';
import { character } from '../gameplay/character';
import { npc } from './npc';

/**
 * Tracks the relationship between a character and an NPC.
 * Includes friendship, trust, romance, and loyalty values.
 */
export const characterNpcRelationship = pgTable('character_npc_relationship', {
	id: serial('id').primaryKey(),
	characterId: integer('character_id')
		.references(() => character.id, { onDelete: 'cascade' })
		.notNull(),
	npcId: integer('npc_id')
		.references(() => npc.id, { onDelete: 'cascade' })
		.notNull(),
	
	// Relationship metrics
	relationshipLevel: integer('relationship_level').default(0), // 0-100 scale
	relationshipStatus: text('relationship_status').default('stranger'), // 'stranger', 'acquaintance', 'friend', 'close_friend', 'romance', 'rival', 'enemy'
	
	trustLevel: integer('trust_level').default(50), // 0-100, starts at neutral (50)
	loyaltyLevel: integer('loyalty_level').default(50), // For companions, affects their choices
	
	// Romance system
	romanceUnlocked: boolean('romance_unlocked').default(false),
	romanceLevel: integer('romance_level').default(0), // 0-100 if romanceable
	
	// Interaction tracking
	lastInteractionAt: timestamp('last_interaction_at'),
	totalInteractions: integer('total_interactions').default(0),
	
	// Interaction history (stores key moments)
	interactionHistory: jsonb('interaction_history').$type<{
		timestamp: string;
		type: 'dialogue' | 'gift' | 'quest' | 'choice' | 'combat';
		description: string;
		relationshipChange: number;
		trustChange?: number;
		loyaltyChange?: number;
	}[]>().default([]),
	
	// Personal quest status
	personalQuestCompleted: boolean('personal_quest_completed').default(false),
	personalQuestId: integer('personal_quest_id'), // Reference to quest
	
	// Flags
	hasMetBefore: boolean('has_met_before').default(false),
	firstMeetingAt: timestamp('first_meeting_at'),
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
