import { pgTable, integer, serial } from 'drizzle-orm/pg-core';
import { player } from '../core/player';
import { location } from './location';

export const playerLocation = pgTable('player_location', {
    id: serial('id').primaryKey(),
    playerId: integer('player_id')
        .notNull()
        .references(() => player.id),
    locationId: integer('location_id')
        .notNull()
        .references(() => location.id),
    x: integer('x').notNull(),
    y: integer('y').notNull(),
});
