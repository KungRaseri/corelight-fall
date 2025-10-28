import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const act = pgTable('act', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(), // e.g., "ACT I"
	order: integer('order').default(0).notNull()
});
