import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const stat = pgTable('stat', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description')
});
