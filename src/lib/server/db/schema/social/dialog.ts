import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const dialog = pgTable('dialog', {
    id: serial('id').primaryKey(),
    text: text('text').notNull(),
});
