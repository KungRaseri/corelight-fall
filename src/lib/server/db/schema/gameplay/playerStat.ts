import { integer, pgTable } from "drizzle-orm/pg-core";
import { player } from "../core/player";
import { stat } from "./stat";

export const playerStat = pgTable('player_stat', {
    playerId: integer('player_id').references(() => player.id),
    statId: integer('stat_id').references(() => stat.id),
    value: integer('value').notNull().default(0)
});

