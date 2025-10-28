import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const item = pgTable('item', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	type: text('type'),
	description: text('description')
});
