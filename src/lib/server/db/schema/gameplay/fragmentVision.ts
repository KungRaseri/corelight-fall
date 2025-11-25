import { pgTable, serial, text, integer, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { fragment } from './fragment';

/**
 * Visions triggered by fragments - memories and knowledge from the Age of Radiance.
 * These reveal lore, unlock quests, and progress the story.
 */
export const fragmentVision = pgTable('fragment_vision', {
	id: serial('id').primaryKey(),
	fragmentId: integer('fragment_id')
		.references(() => fragment.id, { onDelete: 'cascade' })
		.notNull(),
	
	// Vision identification
	title: text('title').notNull(), // "The Fall Begins", "Luminarch Council", "First Corruption"
	slug: text('slug').notNull().unique(), // "the_fall_begins", "luminarch_council"
	visionNumber: integer('vision_number'), // Sequential order for multi-part visions
	
	// Content
	description: text('description').notNull(), // Summary of what's seen
	
	// Vision scenes (structured content)
	visionContent: jsonb('vision_content').$type<{
		scenes: {
			sceneNumber: number;
			setting: string; // "The Radiant Spire, 300 years ago"
			narration: string;
			visualDescription: string;
			audioDescription?: string; // Sound effects, music cues
			characters?: string[]; // NPCs/Luminarchs appearing
			duration?: number; // Seconds
		}[];
		epilogue?: string; // Closing narration
	}>().notNull(),
	
	// Trigger conditions
	triggeredWhen: jsonb('triggered_when').$type<{
		attunementLevel?: number; // Min attunement level needed
		questCompleted?: number[]; // Quest IDs that must be done
		flagsSet?: { name: string; value: boolean | number | string }[];
		locationId?: number; // Must be in specific location
		timeOfDay?: string; // 'dawn', 'day', 'dusk', 'night'
		randomChance?: number; // 0-100 percentage chance
		firstEquip?: boolean; // Triggers on first equip
	}>(),
	
	// Outcomes
	loreUnlocked: jsonb('lore_unlocked').$type<string[]>().default([]), // Lore entries unlocked
	questsUnlocked: jsonb('quests_unlocked').$type<number[]>().default([]), // Quest IDs
	flagsSet: jsonb('flags_set').$type<{ name: string; value: boolean | number | string }[]>().default([]),
	
	// Rewards
	xpReward: integer('xp_reward').default(0),
	knowledgeGained: text('knowledge_gained'), // What the player learns
	
	// Vision metadata
	category: text('category'), // 'main_story', 'side_lore', 'character_backstory', 'world_history'
	emotionalTone: text('emotional_tone'), // 'tragic', 'hopeful', 'ominous', 'revelatory', 'nostalgic'
	importance: integer('importance').default(5), // 1-10 scale
	
	// Can this vision be seen again?
	canRewatch: boolean('can_rewatch').default(true),
	
	isActive: boolean('is_active').default(true),
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
