import { integer, pgTable } from 'drizzle-orm/pg-core';
import { recipe } from './recipe';
import { item } from '../gameplay/item';

export const recipeIngredient = pgTable('recipe_ingredient', {
	recipeId: integer('recipe_id').references(() => recipe.id),
	itemId: integer('item_id').references(() => item.id),
	quantity: integer('quantity').notNull()
});
