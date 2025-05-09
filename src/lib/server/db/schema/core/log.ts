import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { player } from './player';

export const logEntry = pgTable('log_entry', {
    id: serial('id').primaryKey(),
    playerId: integer('player_id').references(() => player.id),
    message: text('message').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    category: text('category')
});
