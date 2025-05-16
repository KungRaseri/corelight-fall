import { integer, pgTable } from "drizzle-orm/pg-core";
import { faction } from "./faction";

export const characterFaction = pgTable('character_faction', {
    characterId: integer('character_id').references(() => character.id),
    factionId: integer('faction_id').references(() => faction.id),
    reputation: integer('reputation').default(0)
});
