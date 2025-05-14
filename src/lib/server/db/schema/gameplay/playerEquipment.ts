import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { item, player } from "..";

export const playerEquipment = pgTable('player_equipment', {
    playerId: integer('player_id').references(() => player.id).notNull(),
    itemId: integer('item_id').references(() => item.id).notNull(),
    slot: text('slot').notNull(), // e.g., "head", "chest", "weapon"
}, (table) => [
    primaryKey({
        columns: [table.playerId, table.itemId]
    })
]);
