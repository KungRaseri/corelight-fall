import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { achievement } from "./achievement";
import { character } from "../gameplay/character";

export const characterAchievement = pgTable('character_achievement', {
    characterId: integer('character_id').references(() => character.id),
    achievementId: integer('achievement_id').references(() => achievement.id),
    achievedAt: timestamp('achieved_at').defaultNow()
});
