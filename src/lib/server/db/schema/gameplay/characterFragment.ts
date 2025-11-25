import { pgTable, serial, integer, timestamp, text, boolean } from 'drizzle-orm/pg-core';
import { character } from './character';
import { fragment } from './fragment';

/**
 * Tracks which fragments each character possesses and their attunement level.
 */
export const characterFragment = pgTable('character_fragment', {
	id: serial('id').primaryKey(),
	characterId: integer('character_id')
		.references(() => character.id, { onDelete: 'cascade' })
		.notNull(),
	fragmentId: integer('fragment_id')
		.references(() => fragment.id, { onDelete: 'cascade' })
		.notNull(),
	
	// Acquisition
	acquiredAt: timestamp('acquired_at').defaultNow().notNull(),
	acquiredHow: text('acquired_how').notNull(), // 'found', 'quest_reward', 'trade', 'combat_drop', 'merchant', 'gift'
	acquiredFromQuestId: integer('acquired_from_quest_id'), // If from quest
	acquiredFromNpcId: integer('acquired_from_npc_id'), // If from NPC
	
	// Attunement system
	isAttuned: boolean('is_attuned').default(false),
	attunementLevel: integer('attunement_level').default(0), // 0-100 scale
	attunementProgress: integer('attunement_progress').default(0), // Progress to next level
	lastAttunementGain: timestamp('last_attunement_gain'),
	
	// Equipment status
	isEquipped: boolean('is_equipped').default(false),
	equippedAt: timestamp('equipped_at'),
	equippedSlot: text('equipped_slot'), // 'primary', 'secondary', 'tertiary' (player can equip multiple)
	
	// Vision tracking
	visionsSeen: integer('visions_seen').default(0),
	lastVisionAt: timestamp('last_vision_at'),
	
	// Fragment-specific tracking
	totalUseCount: integer('total_use_count').default(0), // Times abilities used
	corruptionResisted: integer('corruption_resisted').default(0), // Times resisted corruption
	
	// Notes
	playerNotes: text('player_notes'), // Player can add notes about the fragment
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
