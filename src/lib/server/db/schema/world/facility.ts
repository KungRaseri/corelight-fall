import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const facility = pgTable('facility', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description')
});
