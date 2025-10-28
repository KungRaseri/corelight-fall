import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { enemy } from './enemy';

export const combatEncounter = pgTable('combat_encounter', {
	id: serial('id').primaryKey(),
	characterId: integer('character_id'),
	enemyId: integer('enemy_id').references(() => enemy.id),
	occurredAt: timestamp('occurred_at', { withTimezone: true, mode: 'date' }).notNull(),
	result: text('result')
});
