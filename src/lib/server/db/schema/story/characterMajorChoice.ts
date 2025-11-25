import { pgTable, serial, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { character } from '../gameplay/character';
import { majorChoice } from './majorChoice';

/**
 * Tracks which major choices each character has made and their outcomes.
 */
export const characterMajorChoice = pgTable('character_major_choice', {
	id: serial('id').primaryKey(),
	characterId: integer('character_id')
		.references(() => character.id, { onDelete: 'cascade' })
		.notNull(),
	majorChoiceId: integer('major_choice_id')
		.references(() => majorChoice.id, { onDelete: 'cascade' })
		.notNull(),
	
	// What was chosen
	chosenOptionId: text('chosen_option_id').notNull(), // References choiceOptions[].id from majorChoice
	chosenOptionLabel: text('chosen_option_label').notNull(), // Store for easy display
	
	// Outcome tracking
	outcome: jsonb('outcome').$type<{
		flagsSet: { name: string; value: boolean | number | string }[];
		relationshipChanges?: { npcId: number; npcName: string; change: number }[];
		factionChanges?: { factionId: number; factionName: string; change: number }[];
		itemsGained?: number[];
		itemsLost?: number[];
		questsUnlocked?: number[];
		questsBlocked?: number[];
	}>(),
	
	// Metadata
	chosenAt: timestamp('chosen_at').defaultNow().notNull(),
	
	createdAt: timestamp('created_at').defaultNow().notNull()
});
