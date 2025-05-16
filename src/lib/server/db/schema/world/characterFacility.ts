import { integer, pgTable } from "drizzle-orm/pg-core";
import { facility } from "./facility";
import { character } from "../gameplay/character";

export const characterFacility = pgTable('character_facility', {
    characterId: integer('character_id').references(() => character.id),
    facilityId: integer('facility_id').references(() => facility.id),
    level: integer('level').notNull()
});
