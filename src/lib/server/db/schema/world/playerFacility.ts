import { integer, pgTable } from "drizzle-orm/pg-core";
import { player } from "../core/user";
import { facility } from "./facility";

export const playerFacility = pgTable('player_facility', {
    playerId: integer('player_id').references(() => player.id),
    facilityId: integer('facility_id').references(() => facility.id),
    level: integer('level').notNull()
});
