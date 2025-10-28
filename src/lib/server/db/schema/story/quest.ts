import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { storyline } from './storyline';

export const quest = pgTable('quest', {
	id: serial('id').primaryKey(),
	storylineId: integer('storyline_id')
		.references(() => storyline.id)
		.notNull(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	tone: text('tone'),
	goals: text('goals'),
	summary: text('summary'),
	tags: text('tags'),
	factions: text('factions'),
	order: integer('order').default(0).notNull(),
	isMain: boolean('is_main').default(false).notNull(),
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
