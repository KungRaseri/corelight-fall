import { pgTable, integer, primaryKey } from 'drizzle-orm/pg-core';
import { item } from './item';
import { character } from './character';

export const characterItem = pgTable(
	'character_item',
	{
		characterId: integer('character_id')
			.references(() => character.id)
			.notNull(),
		itemId: integer('item_id')
			.references(() => item.id)
			.notNull(),
		quantity: integer('quantity').notNull()
	},
	(table) => [
		primaryKey({
			columns: [table.characterId, table.itemId]
		})
	]
);
