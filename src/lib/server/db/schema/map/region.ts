import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const region = pgTable('region', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description')
});
