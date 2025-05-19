import { text, serial, timestamp, pgTable, integer } from 'drizzle-orm/pg-core';
import { quest } from './quest';

// Encounter table (belongs to a quest)
export const encounter = pgTable('encounter', {
    id: serial('id').primaryKey(),
    questId: integer('quest_id').references(() => quest.id).notNull(),
    title: text('title').notNull(),
    description: text('description'),
    type: text('type'), // e.g. 'combat', 'dialogue', 'puzzle'
    order: integer('order'), // for ordering encounters in a quest
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});