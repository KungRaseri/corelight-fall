import { text, serial, timestamp, pgTable, integer } from 'drizzle-orm/pg-core';
import { quest } from './quest';

// Encounter table (belongs to a quest)
export const encounter = pgTable('encounter', {
    id: serial('id').primaryKey(),
    questId: integer('quest_id').references(() => quest.id).notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    type: text('type').notNull(), // e.g. 'combat', 'dialogue', 'puzzle'
    order: integer('order').notNull(), // for ordering encounters in a quest
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});