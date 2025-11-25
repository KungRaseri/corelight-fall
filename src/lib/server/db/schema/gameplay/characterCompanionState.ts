import { pgTable, serial, integer, text, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { character } from './character';
import { companion } from './companion';

/**
 * Tracks the state of each companion for each character.
 * Includes loyalty, availability, equipment, and progression.
 */
export const characterCompanionState = pgTable('character_companion_state', {
	id: serial('id').primaryKey(),
	characterId: integer('character_id')
		.references(() => character.id, { onDelete: 'cascade' })
		.notNull(),
	companionId: integer('companion_id')
		.references(() => companion.id, { onDelete: 'cascade' })
		.notNull(),
	
	// Companion status
	status: text('status').notNull(), // 'unavailable', 'available', 'active', 'dismissed', 'left', 'dead', 'betrayed'
	
	// Loyalty system
	loyaltyLevel: integer('loyalty_level').default(50), // 0-100 scale, starts neutral
	loyaltyHistory: jsonb('loyalty_history').$type<{
		timestamp: string;
		change: number;
		reason: string;
		questId?: number;
	}[]>().default([]),
	
	// Timeline
	joinedAt: timestamp('joined_at'),
	leftAt: timestamp('left_at'),
	dismissedAt: timestamp('dismissed_at'),
	
	timeWithPlayer: integer('time_with_player').default(0), // Minutes traveled together
	
	// Progression
	companionLevel: integer('companion_level').default(1),
	companionXp: integer('companion_xp').default(0),
	
	// Combat stats (current, modified by level and equipment)
	currentHealth: integer('current_health'),
	maxHealth: integer('max_health'),
	currentAttack: integer('current_attack'),
	currentDefense: integer('current_defense'),
	currentMagic: integer('current_magic'),
	
	// Equipment (references item IDs)
	equippedWeapon: integer('equipped_weapon'),
	equippedArmor: integer('equipped_armor'),
	equippedAccessory: integer('equipped_accessory'),
	inventory: jsonb('inventory').$type<number[]>().default([]), // Item IDs they're carrying
	
	// Abilities
	unlockedAbilities: jsonb('unlocked_abilities').$type<string[]>().default([]), // Ability IDs
	favoriteAbility: text('favorite_ability'), // Ability they prefer to use
	
	// Personal quest
	personalQuestCompleted: boolean('personal_quest_completed').default(false),
	personalQuestStartedAt: timestamp('personal_quest_started_at'),
	personalQuestCompletedAt: timestamp('personal_quest_completed_at'),
	
	// Romance (if applicable)
	romanceActive: boolean('romance_active').default(false),
	romanceLevel: integer('romance_level').default(0), // 0-100
	romanceUnlocked: boolean('romance_unlocked').default(false),
	
	// Combat stats tracking
	totalCombatsParticipated: integer('total_combats_participated').default(0),
	totalKills: integer('total_kills').default(0),
	totalDamageDone: integer('total_damage_done').default(0),
	totalHealingDone: integer('total_healing_done').default(0),
	timesDowned: integer('times_downed').default(0),
	
	// Dialogue state
	lastDialogueAt: timestamp('last_dialogue_at'),
	dialoguesCompleted: jsonb('dialogues_completed').$type<number[]>().default([]), // Dialogue tree IDs
	
	// Flags
	hasBetrayed: boolean('has_betrayed').default(false),
	canRejoin: boolean('can_rejoin').default(true),
	
	// Player notes
	playerNotes: text('player_notes'),
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
