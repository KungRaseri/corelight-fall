import { integer, pgTable } from "drizzle-orm/pg-core";
import { player } from "../core/player";
import { faction } from "./faction";

export const playerFaction = pgTable('player_faction', {
    playerId: integer('player_id').references(() => player.id),
    factionId: integer('faction_id').references(() => faction.id),
    reputation: integer('reputation').default(0)
});
