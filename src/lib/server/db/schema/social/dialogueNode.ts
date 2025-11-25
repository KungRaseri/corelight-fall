import { pgTable, serial, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { dialogueTree } from './dialogueTree';

/**
 * Individual nodes within a dialogue tree.
 * Can be NPC speech, player speech, or narrator text.
 */
export const dialogueNode = pgTable('dialogue_node', {
	id: serial('id').primaryKey(),
	treeId: integer('tree_id')
		.references(() => dialogueTree.id, { onDelete: 'cascade' })
		.notNull(),
	
	// Content
	speakerType: text('speaker_type').notNull(), // 'npc', 'player', 'narrator'
	speakerName: text('speaker_name'), // For display (can differ from NPC name)
	text: text('text').notNull(), // The actual dialogue text
	
	// Presentation
	mood: text('mood'), // 'happy', 'sad', 'angry', 'neutral', 'worried', 'excited'
	animation: text('animation'), // 'nod', 'shake_head', 'gesture', 'laugh', 'sigh'
	portraitOverride: text('portrait_override'), // Use different portrait for this node
	
	// Flow control (for linear dialogue)
	nextNodeId: integer('next_node_id'), // null if this leads to choices or ends
	
	// Skill check requirement (optional)
	requiresCheck: jsonb('requires_check').$type<{
		attribute: string; // 'Vigor', 'Presence', 'Finesse', 'Mind'
		difficulty: number;
		successNodeId?: number;
		failureNodeId?: number;
	}>(),
	
	// Consequences of reaching this node
	onReach: jsonb('on_reach').$type<{
		setFlags?: { name: string; value: boolean | number | string }[];
		giveItems?: number[];
		removeItems?: number[];
		giveXp?: number;
		giveGold?: number;
		relationshipChange?: { npcId: number; change: number };
		factionChange?: { factionId: number; change: number };
	}>(),
	
	// Metadata
	order: integer('order').default(0), // For organizing nodes in editor
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
