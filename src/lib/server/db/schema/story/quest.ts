import { text, boolean, serial, timestamp, pgTable, integer } from 'drizzle-orm/pg-core';
import { storyline } from './storyline';


// Quest table (belongs to a storyline)
export const quest = pgTable('quest', {
    id: serial('id').primaryKey(),
    storylineId: integer('storyline_id').references(() => storyline.id).notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    order: integer('order').default(0).notNull(), // for ordering quests in a storyline
    isMainQuest: boolean('is_main_quest').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});