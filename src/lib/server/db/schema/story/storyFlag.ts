import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { character } from '../gameplay/character';
import { quest } from './quest';

/**
 * Tracks story flags/variables that affect narrative branching.
 * Examples: 'helped_lynn', 'sold_fragment_to_venn', 'torren_trust_level', 'knows_truth_about_luminarchs'
 */
export const storyFlag = pgTable('story_flag', {
	id: serial('id').primaryKey(),
	characterId: integer('character_id')
		.references(() => character.id, { onDelete: 'cascade' })
		.notNull(),
	
	// Flag identification
	flagName: text('flag_name').notNull(), // Unique identifier for this flag
	category: text('category'), // 'moral_choice', 'relationship', 'lore', 'world_state', 'quest'
	
	// Flag value (supports different types)
	flagType: text('flag_type').notNull(), // 'boolean', 'integer', 'text'
	booleanValue: boolean('boolean_value'),
	integerValue: integer('integer_value'),
	textValue: text('text_value'),
	
	// Metadata
	description: text('description'), // What this flag represents
	setByQuestId: integer('set_by_quest_id').references(() => quest.id), // Which quest set this flag
	setByEncounterId: integer('set_by_encounter_id'), // Which encounter set this flag
	setByChoiceId: integer('set_by_choice_id'), // Which choice set this flag
	
	// Can this flag change or is it permanent?
	isPermanent: boolean('is_permanent').default(false),
	
	setAt: timestamp('set_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
