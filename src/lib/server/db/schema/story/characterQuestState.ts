import { pgTable, serial, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { character } from '../gameplay/character';
import { quest } from './quest';

/**
 * Tracks the state of each quest for each character.
 * Includes progress, choices made, and completion status.
 */
export const characterQuestState = pgTable('character_quest_state', {
	id: serial('id').primaryKey(),
	characterId: integer('character_id')
		.references(() => character.id, { onDelete: 'cascade' })
		.notNull(),
	questId: integer('quest_id')
		.references(() => quest.id, { onDelete: 'cascade' })
		.notNull(),
	
	// Quest status
	status: text('status').notNull(), // 'locked', 'available', 'active', 'completed', 'failed', 'abandoned'
	
	// Timing
	startedAt: timestamp('started_at'),
	completedAt: timestamp('completed_at'),
	failedAt: timestamp('failed_at'),
	
	// Progress tracking
	objectivesCompleted: jsonb('objectives_completed').$type<number[]>().default([]), // Array of quest_objective IDs
	currentObjective: integer('current_objective'), // Current active objective ID
	
	// Choice tracking
	choicesMade: jsonb('choices_made').$type<{
		encounterId: number;
		choiceId: number;
		timestamp: string;
		outcome: string;
	}[]>().default([]),
	
	// Metadata
	timesAttempted: integer('times_attempted').default(0),
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
