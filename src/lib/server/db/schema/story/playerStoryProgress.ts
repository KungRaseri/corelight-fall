import { text, serial, timestamp, pgTable, integer } from 'drizzle-orm/pg-core';

// Encounter table (belongs to a quest)
export const playerStoryProgress = pgTable('player_story_progress', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    storylineId: integer('storyline_id').notNull(),
    questId: integer('quest_id').notNull(),
    encounterId: integer('encounter_id').notNull(),
    choiceId: integer('choice_id').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});