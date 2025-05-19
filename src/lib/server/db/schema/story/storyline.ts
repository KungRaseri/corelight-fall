import { text, boolean, serial, timestamp, pgTable } from 'drizzle-orm/pg-core';

// Storyline table (main arcs and side arcs)
export const storyline = pgTable('storyline', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    isMain: boolean('is_main').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});