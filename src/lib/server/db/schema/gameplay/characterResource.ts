import { pgTable, integer } from 'drizzle-orm/pg-core';
import { resource } from './resource';
import { character } from './character';

export const characterResource = pgTable('character_resource', {
	characterId: integer('character_id')
		.notNull()
		.references(() => character.id),
	resourceId: integer('resource_id')
		.notNull()
		.references(() => resource.id),
	quantity: integer('quantity')
		.notNull()
		.default(0)
});
