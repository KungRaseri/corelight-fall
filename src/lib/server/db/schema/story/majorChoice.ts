import { pgTable, serial, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { quest } from './quest';
import { encounter } from './encounter';

/**
 * Defines major story choices that have significant consequences.
 * Examples: Lynn encounter, Fragment revelation, Path selection, Merge vs Destroy ending
 */
export const majorChoice = pgTable('major_choice', {
	id: serial('id').primaryKey(),
	
	// Identification
	name: text('name').notNull().unique(), // "lynn_encounter", "fragment_revelation", "path_selection"
	title: text('title').notNull(), // "A Stranger's Choice", "Reveal the Fragment?"
	description: text('description').notNull(),
	
	// Context
	questId: integer('quest_id').references(() => quest.id),
	encounterId: integer('encounter_id').references(() => encounter.id),
	actNumber: integer('act_number'), // Which act this choice occurs in
	
	// Choice options
	choiceOptions: jsonb('choice_options').$type<{
		id: string;
		label: string;
		description: string;
		alignmentShift?: { moral: number; pragmatic: number };
		tags?: string[];
	}[]>().notNull(),
	
	// Consequences
	consequences: jsonb('consequences').$type<{
		optionId: string;
		immediateEffects: string[];
		longTermEffects: string[];
		flagsSet: { name: string; value: boolean | number | string }[];
		relationshipChanges?: { npcId: number; change: number }[];
		factionChanges?: { factionId: number; change: number }[];
	}[]>(),
	
	// Category
	category: text('category').notNull(), // 'moral', 'strategic', 'relationship', 'faction', 'ending'
	weight: integer('weight').default(5), // How impactful is this choice? (1-10)
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
