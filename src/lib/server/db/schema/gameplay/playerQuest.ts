import { pgTable, integer, timestamp, text } from "drizzle-orm/pg-core";
import { player } from "../core/player";
import { quest } from "./quest";

export const playerQuest = pgTable('player_quest', {
    playerId: integer('player_id').references(() => player.id),
    questId: integer('quest_id').references(() => quest.id),
    status: text('status'),
    startedAt: timestamp('started_at').defaultNow(),
    completedAt: timestamp('completed_at')
});
