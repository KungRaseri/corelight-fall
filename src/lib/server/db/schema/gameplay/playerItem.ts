import { pgTable, integer } from 'drizzle-orm/pg-core';
import { player } from '../core/player';
import { item } from './item';

export const playerItem = pgTable('player_item', {
    playerId: integer('player_id').references(() => player.id),
    itemId: integer('item_id').references(() => item.id),
    quantity: integer('quantity').notNull()
});
