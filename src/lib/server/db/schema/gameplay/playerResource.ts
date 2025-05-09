import { pgTable, integer } from 'drizzle-orm/pg-core';
import { player } from '../core/player';
import { resource } from './resource';

export const playerResource = pgTable('player_resource', {
	playerId: integer('player_id')
		.notNull()
		.references(() => player.id),
	resourceId: integer('resource_id')
		.notNull()
		.references(() => resource.id),
	quantity: integer('quantity')
		.notNull()
		.default(0)
});
