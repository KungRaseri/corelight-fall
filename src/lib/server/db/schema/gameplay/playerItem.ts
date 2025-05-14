import { pgTable, integer, primaryKey } from 'drizzle-orm/pg-core';
import { player } from '../core/player';
import { item } from './item';

export const playerItem = pgTable('player_item', {
    playerId: integer('player_id').references(() => player.id).notNull(),
    itemId: integer('item_id').references(() => item.id).notNull(),
    quantity: integer('quantity').notNull()
}, (table) => [
    primaryKey({
        columns: [table.playerId, table.itemId]
    })
]);
