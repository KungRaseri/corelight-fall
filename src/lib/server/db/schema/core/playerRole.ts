// src/lib/server/db/schema/core/playerRole.ts
import { pgTable, integer } from 'drizzle-orm/pg-core';
import { player } from './user';
import { role } from './role';

export const playerRole = pgTable('player_role', {
    playerId: integer('player_id')
        .references(() => player.id)
        .notNull(),
    roleId: integer('role_id')
        .references(() => role.id)
        .notNull()
});
