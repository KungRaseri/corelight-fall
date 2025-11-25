import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

/**
 * Corelight fragments - ancient Luminarch technology scattered across the world.
 * Types: Navigator (player's), Prime (major), Standard, Corrupted
 */
export const fragment = pgTable('fragment', {
	id: serial('id').primaryKey(),
	
	// Identification
	name: text('name').notNull(), // "Navigator Fragment", "Memory Core Prime", "Corrupted Shard"
	slug: text('slug').notNull().unique(), // "navigator_fragment", "memory_core_prime"
	
	// Fragment classification
	type: text('type').notNull(), // 'navigator', 'prime', 'standard', 'corrupted'
	tier: integer('tier').default(1), // Power tier (1-5, with 5 being most powerful)
	
	// Description and lore
	description: text('description').notNull(),
	loreText: text('lore_text'), // Backstory and history
	discoveryLore: text('discovery_lore'), // What players learn when first finding it
	
	// Power and abilities
	powerLevel: integer('power_level').default(1), // Raw power output (1-100)
	corruptionLevel: integer('corruption_level').default(0), // Corruption percentage (0-100)
	
	// Fragment abilities (varies by fragment)
	abilities: jsonb('abilities').$type<{
		id: string;
		name: string;
		description: string;
		type: 'active' | 'passive';
		cooldown?: number; // For active abilities
		requirements?: { attribute: string; minValue: number }[];
	}[]>(),
	
	// Attunement system
	requiresAttunement: boolean('requires_attunement').default(true),
	attunementDifficulty: integer('attunement_difficulty').default(10), // DC for attuning
	maxAttunementLevel: integer('max_attunement_level').default(100),
	
	// Location and discovery
	currentLocationId: integer('current_location_id'), // Where is it now (null if player has it)
	discoveryQuestId: integer('discovery_quest_id'), // Quest where it can be found
	isHidden: boolean('is_hidden').default(true), // Hidden until discovered
	
	// Ownership tracking
	foundByCharacterId: integer('found_by_character_id'), // Who found it (nullable)
	canBeTradedOrSold: boolean('can_be_traded_or_sold').default(false),
	
	// Visual
	iconUrl: text('icon_url'),
	glowColor: text('glow_color'), // Hex color for visual effect
	
	// Metadata
	isActive: boolean('is_active').default(true),
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
