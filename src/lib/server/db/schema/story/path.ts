import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { faction } from '../social/faction';
import { quest } from './quest';

/**
 * Defines the three starting paths players can choose from:
 * - Scavenger's Path (Forgewalker route)
 * - Seeker's Path (Conclave route)
 * - Drifter's Path (Independent route - future)
 */
export const path = pgTable('path', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(), // "Scavenger's Path", "Seeker's Path", "Drifter's Path"
	slug: text('slug').notNull().unique(), // "scavenger", "seeker", "drifter"
	description: text('description').notNull(),
	
	// Path characteristics
	philosophyDescription: text('philosophy_description'), // What this path believes
	gameplayFocus: text('gameplay_focus'), // "combat-crafting", "lore-magic", "exploration-stealth"
	
	// Starting conditions
	startingLocationId: integer('starting_location_id'), // Reference to location (future)
	startingFactionId: integer('starting_faction_id').references(() => faction.id),
	mentorNpcId: integer('mentor_npc_id'), // Reference to NPC (future)
	firstQuestId: integer('first_quest_id').references(() => quest.id),
	
	// Metadata
	estimatedDuration: integer('estimated_duration').default(180), // Minutes for Act 1
	difficultyRating: integer('difficulty_rating').default(5), // 1-10 scale
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
