import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { player } from "../core/player";
import { statusEffect } from "./statusEffect";

export const playerStatusEffect = pgTable('player_status_effect', {
    playerId: integer('player_id').references(() => player.id),
    statusEffectId: integer('status_effect_id').references(() => statusEffect.id),
    expiresAt: timestamp('expires_at')
});
