import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const enemy = pgTable('enemy', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	health: integer('health').notNull(),
	attack: integer('attack').notNull(),
	defense: integer('defense').notNull(),
	lootEXP: integer('loot_exp').notNull(),
	lootGold: integer('loot_gold').notNull()
});
