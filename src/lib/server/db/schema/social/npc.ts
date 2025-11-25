import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { faction } from './faction';

/**
 * Non-Player Characters in the game world.
 * Includes merchants, quest givers, companions, mentors, and antagonists.
 */
export const npc = pgTable('npc', {
	id: serial('id').primaryKey(),
	
	// Basic information
	name: text('name').notNull(),
	title: text('title'), // "The Forgemaster", "Seeker of Truth", "Drifter King"
	description: text('description').notNull(),
	backstory: text('backstory'),
	
	// Affiliation
	factionId: integer('faction_id').references(() => faction.id),
	role: text('role'), // 'merchant', 'quest_giver', 'companion', 'mentor', 'antagonist', 'neutral'
	
	// Personality
	personality: jsonb('personality').$type<{
		traits: string[]; // "gruff", "wise", "cynical", "hopeful"
		values: string[]; // "loyalty", "freedom", "knowledge", "power"
		fears: string[]; // "betrayal", "corruption", "loss"
		motivations: string[]; // "protect_family", "find_truth", "restore_world"
	}>(),
	
	// Location
	currentLocationId: integer('current_location_id'), // Reference to location (future)
	defaultLocationId: integer('default_location_id'), // Where they usually are
	
	// NPC type flags
	isCompanion: boolean('is_companion').default(false),
	isRomanceable: boolean('is_romanceable').default(false),
	isMentor: boolean('is_mentor').default(false),
	isMerchant: boolean('is_merchant').default(false),
	isQuestGiver: boolean('is_quest_giver').default(false),
	
	// Appearance
	defaultMood: text('default_mood').default('neutral'), // 'happy', 'sad', 'angry', 'neutral', 'worried'
	portraitUrl: text('portrait_url'),
	spriteUrl: text('sprite_url'),
	
	// Combat stats (for companions)
	combatRole: text('combat_role'), // 'tank', 'damage', 'healer', 'support'
	combatAbilities: jsonb('combat_abilities').$type<{
		abilityId: number;
		abilityName: string;
		description: string;
	}[]>(),
	
	// Metadata
	isActive: boolean('is_active').default(true), // Can this NPC be interacted with?
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
