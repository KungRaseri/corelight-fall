import { pgTable, serial, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { dialogueNode } from './dialogueNode';

/**
 * Player choices within a dialogue tree.
 * These branch the conversation based on player decision.
 */
export const dialogueChoice = pgTable('dialogue_choice', {
	id: serial('id').primaryKey(),
	nodeId: integer('node_id')
		.references(() => dialogueNode.id, { onDelete: 'cascade' })
		.notNull(), // The node that presents these choices
	
	// Choice content
	choiceText: text('choice_text').notNull(), // What the player sees as an option
	choiceType: text('choice_type'), // 'aggressive', 'diplomatic', 'deceptive', 'curious', 'compassionate', 'pragmatic'
	
	// Skill check (optional)
	attributeCheck: jsonb('attribute_check').$type<{
		attribute: string; // 'Vigor', 'Presence', 'Finesse', 'Mind'
		difficulty: number;
	}>(),
	skillCheckDifficulty: integer('skill_check_difficulty'), // Simplified check (just DC)
	
	// Branching
	nextNodeId: integer('next_node_id').references(() => dialogueNode.id), // Where does this choice lead?
	failureNodeId: integer('failure_node_id').references(() => dialogueNode.id), // If skill check fails
	
	// Consequences
	consequence: jsonb('consequence').$type<{
		setFlags?: { name: string; value: boolean | number | string }[];
		relationshipChange?: { npcId: number; change: number };
		factionChange?: { factionId: number; change: number };
		giveItems?: number[];
		removeItems?: number[];
		giveXp?: number;
		giveGold?: number;
		unlockQuests?: number[];
		blockQuests?: number[];
	}>(),
	
	// Requirements to show this choice
	requiresFlags: jsonb('requires_flags').$type<{ name: string; value: boolean | number | string }[]>(),
	
	// UI hints
	colorHint: text('color_hint'), // 'red' (aggressive), 'blue' (diplomatic), 'purple' (deceptive), 'green' (curious)
	iconHint: text('icon_hint'), // Icon to show next to choice
	
	// Metadata
	order: integer('order').default(0).notNull(),
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
