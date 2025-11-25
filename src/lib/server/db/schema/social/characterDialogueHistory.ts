import { pgTable, serial, integer, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { character } from '../gameplay/character';
import { dialogueTree } from './dialogueTree';

/**
 * Tracks which dialogues each character has seen and their choices.
 */
export const characterDialogueHistory = pgTable('character_dialogue_history', {
	id: serial('id').primaryKey(),
	characterId: integer('character_id')
		.references(() => character.id, { onDelete: 'cascade' })
		.notNull(),
	dialogueTreeId: integer('dialogue_tree_id')
		.references(() => dialogueTree.id, { onDelete: 'cascade' })
		.notNull(),
	
	// Progress tracking
	lastNodeId: integer('last_node_id'), // Last node viewed
	isCompleted: boolean('is_completed').default(false),
	completedAt: timestamp('completed_at'),
	
	// Choice tracking
	choicesMade: jsonb('choices_made').$type<{
		nodeId: number;
		choiceId: number;
		choiceText: string;
		timestamp: string;
		skillCheckPassed?: boolean;
	}[]>().default([]),
	
	// Outcome
	relationshipImpact: integer('relationship_impact').default(0), // Total relationship change from this conversation
	flagsSet: jsonb('flags_set').$type<{ name: string; value: boolean | number | string }[]>().default([]),
	
	// Metadata
	startedAt: timestamp('started_at').defaultNow().notNull(),
	timesCompleted: integer('times_completed').default(0),
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
