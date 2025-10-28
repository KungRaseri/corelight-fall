import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const location = pgTable('location', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description').notNull(),
	x: integer('x').notNull(),
	y: integer('y').notNull(),
	type: text('type').notNull()
});
