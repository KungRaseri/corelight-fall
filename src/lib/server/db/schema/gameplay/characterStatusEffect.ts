import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { statusEffect } from "./statusEffect";
import { character } from "../core/character";

export const characterStatusEffect = pgTable('character_status_effect', {
    characterId: integer('character_id').references(() => character.id),
    statusEffectId: integer('status_effect_id').references(() => statusEffect.id),
    expiresAt: timestamp('expires_at')
});
