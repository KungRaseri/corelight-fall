import { integer, pgTable } from "drizzle-orm/pg-core";
import { attribute } from "./attribute";
import { character } from "./character";

export const characterAttribute = pgTable('character_attribute', {
    characterId: integer('character_id').references(() => character.id).notNull(),
    attributeId: integer('attribute_id').references(() => attribute.id).notNull(),
    value: integer('value').notNull().default(0)
});

