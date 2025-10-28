import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core';

export const statusEffect = pgTable('status_effect', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description'),
	duration: integer('duration')
});
