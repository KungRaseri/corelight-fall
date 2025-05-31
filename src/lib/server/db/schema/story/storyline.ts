import { text, boolean, serial, timestamp, integer, pgTable } from 'drizzle-orm/pg-core';
import { phase } from './phase';

// Storyline table (main arcs and side arcs)
export const storyline = pgTable('storyline', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    phaseId: integer('phase_id').references(() => phase.id), // normalized phase reference
    tone: text('tone'),
    goals: text('goals'),
    summary: text('summary'),
    tags: text('tags'),
    factions: text('factions'),
    order: integer('order').default(0).notNull(),
    isMain: boolean('is_main').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    coverImage: text('cover_image'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});