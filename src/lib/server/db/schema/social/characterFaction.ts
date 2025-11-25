import { integer, pgTable, serial, text, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { faction } from './faction';
import { character } from '../gameplay/character';

/**
 * Enhanced faction reputation system with detailed tracking.
 * Tracks player standing with each faction (Conclave, Forgewalkers, Verdant Circle, Free Drifters)
 */
export const characterFaction = pgTable('character_faction', {
	id: serial('id').primaryKey(),
	characterId: integer('character_id')
		.references(() => character.id, { onDelete: 'cascade' })
		.notNull(),
	factionId: integer('faction_id')
		.references(() => faction.id, { onDelete: 'cascade' })
		.notNull(),
	
	// Reputation system
	reputation: integer('reputation').default(0), // -100 to 100 scale
	reputationLevel: integer('reputation_level').default(0), // 0-100 for positive progression
	reputationTitle: text('reputation_title').default('Neutral'), // 'Hostile', 'Unfriendly', 'Neutral', 'Friendly', 'Honored', 'Exalted'
	
	// Access and privileges
	canTrade: boolean('can_trade').default(true),
	canAccessVendors: boolean('can_access_vendors').default(true),
	canAccessQuests: boolean('can_access_quests').default(true),
	hasAccessToLocations: jsonb('has_access_to_locations').$type<number[]>().default([]), // Location IDs
	
	// Progression tracking
	completedQuests: integer('completed_quests').default(0),
	failedQuests: integer('failed_quests').default(0),
	betrayalCount: integer('betrayal_count').default(0),
	
	// Reputation history
	reputationHistory: jsonb('reputation_history').$type<{
		timestamp: string;
		change: number;
		reason: string;
		questId?: number;
		choiceId?: number;
	}[]>().default([]),
	
	// Special status
	isMember: boolean('is_member').default(false), // Official faction member
	memberSince: timestamp('member_since'),
	rank: text('rank'), // 'Initiate', 'Member', 'Veteran', 'Elite', 'Leader'
	rankLevel: integer('rank_level').default(0), // Numeric rank (0-10)
	
	// Exile/banishment
	isExiled: boolean('is_exiled').default(false),
	exiledAt: timestamp('exiled_at'),
	exileReason: text('exile_reason'),
	canBeReinstated: boolean('can_be_reinstated').default(true),
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
