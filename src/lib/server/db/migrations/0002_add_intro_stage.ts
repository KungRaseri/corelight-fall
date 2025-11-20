import { sql } from 'drizzle-orm';
import { db } from '../index';

/**
 * Migration: Add introStage to playerStoryProgress
 * Tracks player progression through intro content:
 * - null/undefined: Not started
 * - 'tutorial_complete': Finished onboarding tutorial
 * - 'world_intro': Viewing world introduction
 * - 'story_prologue': Viewing story prologue
 * - 'arc_choice': At branching story arc choice
 * - 'main_story': In main storylines
 */
export async function up() {
	await db.execute(sql`
		ALTER TABLE player_story_progress 
		ADD COLUMN IF NOT EXISTS intro_stage TEXT;
	`);
}

export async function down() {
	await db.execute(sql`
		ALTER TABLE player_story_progress 
		DROP COLUMN IF EXISTS intro_stage;
	`);
}
