import { pgTable, serial, text, integer, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { npc } from './npc';
import { quest } from '../story/quest';

/**
 * Dialogue trees for conversations with NPCs.
 * Each tree represents a complete conversation (e.g., "Torren first meeting", "Aria welcome")
 */
export const dialogueTree = pgTable('dialogue_tree', {
	id: serial('id').primaryKey(),
	
	// Identification
	title: text('title').notNull(), // "Torren - First Meeting", "Aria - Welcome to the Sanctum"
	slug: text('slug').notNull().unique(), // "torren_first_meeting", "aria_welcome"
	
	// Context
	npcId: integer('npc_id').references(() => npc.id),
	questId: integer('quest_id').references(() => quest.id), // Optional: tied to specific quest
	
	// Tree structure
	rootNodeId: integer('root_node_id'), // Starting node of the conversation
	
	// Availability conditions
	availableWhen: jsonb('available_when').$type<{
		flags?: { name: string; value: boolean | number | string }[];
		questStatus?: { questId: number; status: string[] }[];
		relationshipLevel?: { npcId: number; minLevel: number }[];
		actNumber?: number;
		customCondition?: string; // For complex logic
	}>(),
	
	// Metadata
	category: text('category'), // 'main_quest', 'side_quest', 'companion', 'merchant', 'lore', 'romance'
	priority: integer('priority').default(5), // Higher priority dialogues show first (1-10)
	canRepeat: boolean('can_repeat').default(false), // Can this conversation happen multiple times?
	
	isActive: boolean('is_active').default(true),
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
