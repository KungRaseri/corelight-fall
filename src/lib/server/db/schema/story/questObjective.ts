import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { quest } from './quest';

/**
 * Individual objectives within a quest.
 * Example: "Kill 5 Corrupted", "Collect 3 Fragments", "Talk to Torren"
 */
export const questObjective = pgTable('quest_objective', {
	id: serial('id').primaryKey(),
	questId: integer('quest_id')
		.references(() => quest.id, { onDelete: 'cascade' })
		.notNull(),
	
	description: text('description').notNull(),
	
	// Objective type and target
	type: text('type').notNull(), // 'kill', 'collect', 'talk', 'explore', 'craft', 'use', 'reach', 'escort', 'defend'
	targetId: integer('target_id'), // ID of enemy, NPC, item, or location
	targetCount: integer('target_count').default(1).notNull(),
	
	// Objective metadata
	isOptional: boolean('is_optional').default(false).notNull(),
	order: integer('order').default(0).notNull(),
	
	// Rewards for completing this specific objective (optional)
	xpReward: integer('xp_reward').default(0),
	goldReward: integer('gold_reward').default(0),
	
	// Conditions
	prerequisiteObjectiveIds: jsonb('prerequisite_objective_ids').$type<number[]>().default([]),
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
