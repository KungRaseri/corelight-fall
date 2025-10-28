import { integer, serial, pgTable } from 'drizzle-orm/pg-core';
import { user } from '../core/user';

export const playerGameState = pgTable('player_game_state', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	storylineId: integer('storyline_id').notNull(),
	questId: integer('quest_id').notNull(),
	encounterId: integer('encounter_id').notNull(),
	updatedAt: integer('updated_at').notNull()
});
