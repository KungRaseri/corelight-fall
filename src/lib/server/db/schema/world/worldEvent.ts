import { pgTable, serial, text, integer, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';

/**
 * World events that affect the game world and story.
 * Examples: The Calling (Act 2), Corruption Surge, Faction War, Festival
 */
export const worldEvent = pgTable('world_event', {
	id: serial('id').primaryKey(),
	
	// Identification
	name: text('name').notNull(), // "The Calling", "Corruption Surge", "Festival of Light"
	slug: text('slug').notNull().unique(), // "the_calling", "corruption_surge"
	title: text('title').notNull(), // Display title
	description: text('description').notNull(),
	
	// Event type
	eventType: text('event_type').notNull(), // 'timed', 'triggered', 'random', 'scheduled'
	category: text('category'), // 'main_story', 'side_event', 'seasonal', 'random', 'faction'
	
	// Trigger conditions (when does this event start?)
	startCondition: jsonb('start_condition').$type<{
		questCompleted?: number[]; // Quest IDs
		flagsSet?: { name: string; value: boolean | number | string }[];
		dateTime?: string; // ISO timestamp for timed events
		gameDay?: number; // In-game day number
		locationId?: number; // Player must be in location
		randomChance?: number; // 0-100 percentage
		actNumber?: number; // Must be in specific act
		allPlayersReachLevel?: number; // All players must be this level (multiplayer)
	}>(),
	
	// End conditions (when does this event end?)
	endCondition: jsonb('end_condition').$type<{
		questCompleted?: number[];
		flagsSet?: { name: string; value: boolean | number | string }[];
		durationMinutes?: number; // Real-time minutes
		gameDays?: number; // In-game days
		playerChoice?: string; // Ends when player makes specific choice
		automatic?: boolean; // Ends automatically when conditions met
	}>(),
	
	// Event effects on the world
	worldStateChanges: jsonb('world_state_changes').$type<{
		flags?: { name: string; value: boolean | number | string }[];
		locationChanges?: { locationId: number; newState: string; description: string }[];
		npcChanges?: { npcId: number; newLocation?: number; newMood?: string; available?: boolean }[];
		merchantInventoryChanges?: { merchantId: number; addItems?: number[]; removeItems?: number[] }[];
		environmentalEffects?: { type: string; description: string }[]; // Weather, lighting, etc.
	}>(),
	
	// Quest impact
	questsUnlocked: jsonb('quests_unlocked').$type<number[]>().default([]),
	questsBlocked: jsonb('quests_blocked').$type<number[]>().default([]), // Quests that become unavailable
	questsAutoCompleted: jsonb('quests_auto_completed').$type<number[]>().default([]), // Quests that auto-complete
	questsAutoFailed: jsonb('quests_auto_failed').$type<number[]>().default([]), // Quests that auto-fail
	
	// NPC and faction effects
	factionReputationChanges: jsonb('faction_reputation_changes').$type<{
		factionId: number;
		change: number;
		reason: string;
	}[]>(),
	
	// Narrative
	startNarration: text('start_narration'), // Text shown when event starts
	endNarration: text('end_narration'), // Text shown when event ends
	
	// Visual and audio
	visualEffects: jsonb('visual_effects').$type<{
		skyColor?: string;
		ambientLight?: string;
		particleEffects?: string[];
	}>(),
	audioEffects: text('audio_effects'), // Music or sound effects
	
	// Priority and importance
	priority: integer('priority').default(5), // Higher priority events override lower ones
	importance: integer('importance').default(5), // 1-10 scale for story significance
	
	// Can this event happen multiple times?
	canRepeat: boolean('can_repeat').default(false),
	repeatCooldownMinutes: integer('repeat_cooldown_minutes'), // Cooldown between repeats
	
	// Metadata
	isActive: boolean('is_active').default(true),
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
