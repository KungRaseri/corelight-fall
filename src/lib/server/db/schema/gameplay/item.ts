import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const item = pgTable('item', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type'),
    description: text('description')
});
