import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const attribute = pgTable('attribute', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description'),
	category: text('category').notNull(), // primary, derived, special
	baseValue: integer('base_value').notNull().default(0),
	scaling: integer('scaling').notNull().default(1) // scaling factor for leveling
});
