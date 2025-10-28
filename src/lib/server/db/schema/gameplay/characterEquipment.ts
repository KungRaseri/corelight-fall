import { integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { item } from '..';
import { character } from './character';

export const characterEquipment = pgTable(
	'character_equipment',
	{
		characterId: integer('character_id')
			.references(() => character.id)
			.notNull(),
		itemId: integer('item_id')
			.references(() => item.id)
			.notNull(),
		slot: text('slot').notNull() // e.g., "head", "chest", "weapon"
	},
	(table) => [
		primaryKey({
			columns: [table.characterId, table.itemId]
		})
	]
);
