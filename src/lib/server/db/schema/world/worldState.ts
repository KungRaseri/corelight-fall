import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const worldState = pgTable('world_state', {
    id: serial('id').primaryKey(),
    key: text('key').notNull().unique(),
    value: text('value').notNull()
});
