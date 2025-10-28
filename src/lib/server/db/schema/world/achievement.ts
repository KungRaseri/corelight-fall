import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { item } from '../gameplay/item';

export const achievement = pgTable('achievement', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description'),
	rewardItemId: integer('reward_item_id').references(() => item.id),
	rewardQuantity: integer('reward_quantity')
});
