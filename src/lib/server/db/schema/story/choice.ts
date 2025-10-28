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
	outcome: text('outcome').notNull(), // Optional: summary of what happens
	order: integer('order').notNull(), // for ordering choices
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
