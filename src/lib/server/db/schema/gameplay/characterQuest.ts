import { pgTable, integer, timestamp, text } from "drizzle-orm/pg-core";
import { quest } from "./quest";

export const characterQuest = pgTable('character_quest', {
    characterId: integer('character_id').references(() => character.id),
    questId: integer('quest_id').references(() => quest.id),
    status: text('status'),
    startedAt: timestamp('started_at').defaultNow(),
    completedAt: timestamp('completed_at')
});
