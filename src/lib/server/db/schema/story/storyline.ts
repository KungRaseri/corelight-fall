import { text, boolean, serial, timestamp, pgTable } from 'drizzle-orm/pg-core';

// Storyline table (main arcs and side arcs)
export const storyline = pgTable('storyline', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    isMain: boolean('is_main').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});