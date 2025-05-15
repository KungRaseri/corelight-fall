import { pgTable, integer, timestamp } from "drizzle-orm/pg-core";
import { player } from "../core/user";
import { recipe } from "./recipe";

export const playerRecipe = pgTable('player_recipe', {
    playerId: integer('player_id').references(() => player.id),
    recipeId: integer('recipe_id').references(() => recipe.id),
    learnedAt: timestamp('learned_at').defaultNow()
});
