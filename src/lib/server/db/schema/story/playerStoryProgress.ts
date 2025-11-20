import { text, serial, timestamp, pgTable, integer } from 'drizzle-orm/pg-core';
import { user } from '../core/user';

// Encounter table (belongs to a quest)
export const playerStoryProgress = pgTable('player_story_progress', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	storylineId: integer('storyline_id').notNull(),
	questId: integer('quest_id'),
	encounterId: integer('encounter_id'),
	choiceId: integer('choice_id'),
	introStage: text('intro_stage'), // 'tutorial_complete' | 'world_intro' | 'story_prologue' | 'arc_choice' | 'main_story'
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
