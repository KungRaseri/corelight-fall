import { pgTable, serial, integer, timestamp, jsonb, boolean, text } from 'drizzle-orm/pg-core';
import { character } from '../gameplay/character';
import { worldEvent } from './worldEvent';

/**
 * Tracks which world events each character has experienced and their choices.
 */
export const characterEventState = pgTable('character_event_state', {
	id: serial('id').primaryKey(),
	characterId: integer('character_id')
		.references(() => character.id, { onDelete: 'cascade' })
		.notNull(),
	eventId: integer('event_id')
		.references(() => worldEvent.id, { onDelete: 'cascade' })
		.notNull(),
	
	// Event status
	hasTriggered: boolean('has_triggered').default(false),
	hasCompleted: boolean('has_completed').default(false),
	
	// Timeline
	triggeredAt: timestamp('triggered_at'),
	completedAt: timestamp('completed_at'),
	
	// Participation
	participated: boolean('participated').default(false), // Did player actively engage?
	participationLevel: text('participation_level'), // 'observer', 'participant', 'key_actor'
	
	// Choices made during event
	choicesMade: jsonb('choices_made').$type<{
		choiceId: string;
		choiceLabel: string;
		timestamp: string;
		consequence?: string;
	}[]>().default([]),
	
	// Outcome
	outcome: text('outcome'), // 'success', 'failure', 'partial', 'neutral', 'skipped'
	outcomeDescription: text('outcome_description'),
	
	// Rewards and consequences
	flagsSet: jsonb('flags_set').$type<{ name: string; value: boolean | number | string }[]>().default([]),
	itemsGained: jsonb('items_gained').$type<number[]>().default([]),
	itemsLost: jsonb('items_lost').$type<number[]>().default([]),
	xpGained: integer('xp_gained').default(0),
	goldGained: integer('gold_gained').default(0),
	
	// Relationship impacts
	relationshipChanges: jsonb('relationship_changes').$type<{
		npcId: number;
		change: number;
		reason: string;
	}[]>().default([]),
	
	factionReputationChanges: jsonb('faction_reputation_changes').$type<{
		factionId: number;
		change: number;
		reason: string;
	}[]>().default([]),
	
	// Can this character experience this event again?
	canRepeat: boolean('can_repeat').default(false),
	timesExperienced: integer('times_experienced').default(0),
	
	// Player notes
	playerNotes: text('player_notes'),
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
