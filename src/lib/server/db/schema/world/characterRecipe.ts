import { pgTable, integer, timestamp } from 'drizzle-orm/pg-core';
import { recipe } from './recipe';
import { character } from '../gameplay/character';

export const characterRecipe = pgTable('character_recipe', {
	characterId: integer('character_id').references(() => character.id),
	recipeId: integer('recipe_id').references(() => recipe.id),
	learnedAt: timestamp('learned_at').defaultNow()
});
