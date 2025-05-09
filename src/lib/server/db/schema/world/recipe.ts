import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { item } from '../gameplay/item';

export const recipe = pgTable('recipe', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    resultItemId: integer('result_item_id').references(() => item.id),
    resultQuantity: integer('result_quantity').notNull().default(1)
});
