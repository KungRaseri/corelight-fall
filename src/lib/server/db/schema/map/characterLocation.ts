import { pgTable, integer, serial } from 'drizzle-orm/pg-core';
import { location } from './location';
import { character } from '../gameplay/character';

export const characterLocation = pgTable('character_location', {
	id: serial('id').primaryKey(),
	characterId: integer('character_id')
		.notNull()
		.references(() => character.id),
	locationId: integer('location_id')
		.notNull()
		.references(() => location.id),
	x: integer('x').notNull(),
	y: integer('y').notNull()
});
