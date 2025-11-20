import { text, serial, timestamp, pgTable, integer } from 'drizzle-orm/pg-core';
import { encounter } from './encounter';

// Choice table (for branching, belongs to an encounter)
export const choice = pgTable('choice', {
	id: serial('id').primaryKey(),
	encounterId: integer('encounter_id')
		.references(() => encounter.id, { onDelete: 'cascade' })
		.notNull(),
	text: text('text').notNull(), // The choice text shown to the player
	nextEncounterId: integer('next_encounter_id').references(() => encounter.id, {
		onDelete: 'cascade'
	}), // null if end
	outcome: text('outcome').notNull(), // Default outcome (or success outcome if check exists)
	xpReward: integer('xp_reward').default(0), // XP gained from this specific choice (or on success)
	goldReward: integer('gold_reward').default(0), // Gold gained from this specific choice (or on success)
	
	// Skill Check System
	requiresCheck: text('requires_check'), // Attribute name to check (e.g., 'Vigor', 'Presence', 'Finesse')
	checkDifficulty: integer('check_difficulty').default(10), // DC for the check (default 10)
	failureOutcome: text('failure_outcome'), // What happens on failure
	failureXpReward: integer('failure_xp_reward').default(0), // XP on failure (usually less)
	failureGoldReward: integer('failure_gold_reward').default(0), // Gold on failure
	failureNextEncounterId: integer('failure_next_encounter_id').references(() => encounter.id, {
		onDelete: 'cascade'
	}), // Different next encounter on failure (optional)
	
	order: integer('order').notNull(), // for ordering choices
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
