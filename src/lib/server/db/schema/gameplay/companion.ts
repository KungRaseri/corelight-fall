import { pgTable, serial, integer, text, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { npc } from '../social/npc';
import { quest } from '../story/quest';

/**
 * Defines NPCs that can join the player as companions.
 * Companions have combat abilities, personal quests, and loyalty mechanics.
 */
export const companion = pgTable('companion', {
	id: serial('id').primaryKey(),
	npcId: integer('npc_id')
		.references(() => npc.id, { onDelete: 'cascade' })
		.notNull()
		.unique(), // Each NPC can only be a companion once
	
	// Recruitment
	joinQuestId: integer('join_quest_id')
		.references(() => quest.id), // Quest where they join
	leaveQuestId: integer('leave_quest_id')
		.references(() => quest.id), // Quest where they permanently leave (optional)
	
	joinRequirements: jsonb('join_requirements').$type<{
		flags?: { name: string; value: boolean | number | string }[];
		relationshipLevel?: number; // Min relationship needed
		questsCompleted?: number[];
		factionReputation?: { factionId: number; minReputation: number }[];
	}>(),
	
	// Combat role and stats
	combatRole: text('combat_role').notNull(), // 'tank', 'damage', 'healer', 'support', 'hybrid'
	combatStyle: text('combat_style'), // 'melee', 'ranged', 'magic', 'stealth'
	
	// Base combat stats (scale with level)
	baseHealth: integer('base_health').default(100),
	baseAttack: integer('base_attack').default(10),
	baseDefense: integer('base_defense').default(10),
	baseMagic: integer('base_magic').default(10),
	
	// Companion abilities
	abilities: jsonb('abilities').$type<{
		id: string;
		name: string;
		description: string;
		type: 'attack' | 'defend' | 'heal' | 'buff' | 'debuff' | 'utility';
		cooldown: number;
		resourceCost: number;
		unlockLevel: number; // Companion level when unlocked
	}[]>(),
	
	// Equipment (what they can wear)
	equipmentSlots: jsonb('equipment_slots').$type<{
		weapon: boolean;
		armor: boolean;
		accessory: boolean;
		consumables: boolean;
	}>().default({ weapon: true, armor: true, accessory: true, consumables: true }),
	
	startingEquipment: jsonb('starting_equipment').$type<number[]>().default([]), // Item IDs
	
	// Personal quest
	personalQuestId: integer('personal_quest_id')
		.references(() => quest.id), // Their companion quest
	personalQuestUnlockRequirements: jsonb('personal_quest_unlock_requirements').$type<{
		loyaltyLevel?: number; // Min loyalty needed
		relationshipLevel?: number;
		questsCompleted?: number[];
		timeWithPlayer?: number; // Minutes
	}>(),
	
	// Companion preferences
	likes: jsonb('likes').$type<string[]>(), // Things that increase loyalty: ["helping_others", "exploration", "combat"]
	dislikes: jsonb('dislikes').$type<string[]>(), // Things that decrease loyalty: ["cruelty", "theft", "cowardice"]
	
	// Loyalty mechanics
	loyaltyGainRate: integer('loyalty_gain_rate').default(1), // Multiplier for loyalty gains
	loyaltyLossRate: integer('loyalty_loss_rate').default(1), // Multiplier for loyalty losses
	canBetrayer: boolean('can_betray').default(false), // Can this companion betray you?
	betrayalThreshold: integer('betrayal_threshold').default(10), // Loyalty level where betrayal occurs
	
	// Dialogue
	idleDialogues: jsonb('idle_dialogues').$type<string[]>(), // Random things they say
	combatDialogues: jsonb('combat_dialogues').$type<{
		onAttack?: string[];
		onHit?: string[];
		onMiss?: string[];
		onKill?: string[];
		onLowHealth?: string[];
		onVictory?: string[];
	}>(),
	
	// Metadata
	isActive: boolean('is_active').default(true),
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
