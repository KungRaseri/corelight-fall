import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const event = pgTable('event', {
    id: serial('id').primaryKey(),
    description: text('description').notNull(),
    type: text('type').notNull()
});
