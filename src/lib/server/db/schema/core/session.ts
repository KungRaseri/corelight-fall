import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { player } from './user';

export const session = pgTable('session', {
    id: text('id').primaryKey(),
    playerId: integer('player_id').notNull().references(() => player.id),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});
