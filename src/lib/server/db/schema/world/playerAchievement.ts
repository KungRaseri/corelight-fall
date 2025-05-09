import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { player } from "../core/player";
import { achievement } from "./achievement";

export const playerAchievement = pgTable('player_achievement', {
    playerId: integer('player_id').references(() => player.id),
    achievementId: integer('achievement_id').references(() => achievement.id),
    achievedAt: timestamp('achieved_at').defaultNow()
});
