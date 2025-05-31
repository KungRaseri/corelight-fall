import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { quest } from './quest';

// Encounter table (belongs to a quest)
export const encounter = pgTable('encounter', {
    id: serial('id').primaryKey(),
    questId: integer('quest_id').references(() => quest.id).notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    type: text('type'), // e.g., "combat", "dialogue", "puzzle", etc.
    tone: text('tone'),
    summary: text('summary'),
    tags: text('tags'),
    factions: text('factions'),
    order: integer('order').default(0).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});