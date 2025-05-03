import { pgTable, serial, text, integer, timestamp, PgSerialBuilder } from 'drizzle-orm/pg-core';

export const player = pgTable('player', {
	id: serial('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	playerId: integer('player_id')
		.notNull()
		.references(() => player.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const resource = pgTable('resource', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description')
});

export const playerResource = pgTable('player_resource', {
	playerId: integer('player_id')
		.notNull()
		.references(() => player.id),
	resourceId: integer('resource_id')
		.notNull()
		.references(() => resource.id),
	quantity: integer('quantity')
		.notNull()
		.default(0)
});

export const region = pgTable('region', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description')
});

export const event = pgTable('event', {
	id: serial('id').primaryKey(),
	regionId: integer('region_id')
		.notNull()
		.references(() => region.id),
	description: text('description').notNull(),
	type: text('type').notNull()
});

export const enemy = pgTable('enemy', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	health: integer('health').notNull(),
	attack: integer('attack').notNull(),
	defense: integer('defense').notNull(),
	lootEXP: integer('loot_exp').notNull(),
	lootGold: integer('loot_gold').notNull()
});

export const combatEncounter = pgTable('combat_encounter', {
	id: serial('id').primaryKey(),
	playerId: integer('player_id').references(() => player.id),
	enemyId: integer('enemy_id').references(() => enemy.id),
	occurredAt: timestamp('occurred_at', { withTimezone: true, mode: 'date' }).notNull(),
	result: text('result')
});

export const item = pgTable('item', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	type: text('type'),
	description: text('description')
});

export const playerItem = pgTable('player_item', {
	playerId: integer('player_id').references(() => player.id),
	itemId: integer('item_id').references(() => item.id),
	quantity: integer('quantity').notNull()
});

export const quest = pgTable('quest', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	regionId: integer('region_id').references(() => region.id),
	rewardEXP: integer('reward_exp').default(0),
	rewardGold: integer('reward_gold').default(0)
});

export const playerQuest = pgTable('player_quest', {
	playerId: integer('player_id').references(() => player.id),
	questId: integer('quest_id').references(() => quest.id),
	status: text('status'),
	startedAt: timestamp('started_at').defaultNow(),
	completedAt: timestamp('completed_at')
});

export const facility = pgTable('facility', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description')
});

export const facilityUpgrade = pgTable('facility_upgrade', {
	id: serial('id').primaryKey(),
	facilityId: integer('facility_id').references(() => facility.id),
	level: integer('level').notNull(),
	costGold: integer('cost_gold'),
	costResourceId: integer('cost_resource_id').references(() => resource.id),
	costResourceAmount: integer('cost_resource_amount'),
	effectDescription: text('effect_description')
});

export const playerFacility = pgTable('player_facility', {
	playerId: integer('player_id').references(() => player.id),
	facilityId: integer('facility_id').references(() => facility.id),
	level: integer('level').notNull()
});

export const faction = pgTable('faction', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description')
});

export const playerFaction = pgTable('player_faction', {
	playerId: integer('player_id').references(() => player.id),
	factionId: integer('faction_id').references(() => faction.id),
	reputation: integer('reputation').default(0)
});

export const stat = pgTable('stat', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description')
});

export const playerStat = pgTable('player_stat', {
	playerId: integer('player_id').references(() => player.id),
	statId: integer('stat_id').references(() => stat.id),
	value: integer('value').notNull().default(0)
});

export const dialog = pgTable('dialog', {
	id: serial('id').primaryKey(),
	eventId: integer('event_id').references(() => event.id),
	text: text('text').notNull(),
});

export const dialogOption = pgTable('dialog_option', {
	id: serial('id').primaryKey(),
	dialogId: integer('dialog_id').references(() => dialog.id),
	text: text('text').notNull(),
	nextDialogId: integer('next_dialog_id').references(() => dialog.id)
});

export const statusEffect = pgTable('status_effect', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description'),
	duration: integer('duration')
});

export const playerStatusEffect = pgTable('player_status_effect', {
	playerId: integer('player_id').references(() => player.id),
	statusEffectId: integer('status_effect_id').references(() => statusEffect.id),
	expiresAt: timestamp('expires_at')
});

export const calendarEvent = pgTable('calendar_event', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	triggerTime: timestamp('trigger_time')
});

export const worldState = pgTable('world_state', {
	id: serial('id').primaryKey(),
	key: text('key').notNull().unique(),
	value: text('value').notNull()
});

export const recipe = pgTable('recipe', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	resultItemId: integer('result_item_id').references(() => item.id),
	resultQuantity: integer('result_quantity').notNull().default(1)
});

export const recipeIngredient = pgTable('recipe_ingredient', {
	recipeId: integer('recipe_id').references(() => recipe.id),
	itemId: integer('item_id').references(() => item.id),
	quantity: integer('quantity').notNull()
});

export const playerRecipe = pgTable('player_recipe', {
	playerId: integer('player_id').references(() => player.id),
	recipeId: integer('recipe_id').references(() => recipe.id),
	learnedAt: timestamp('learned_at').defaultNow()
});

export const achievement = pgTable('achievement', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description'),
	rewardItemId: integer('reward_item_id').references(() => item.id),
	rewardQuantity: integer('reward_quantity')
});

export const playerAchievement = pgTable('player_achievement', {
	playerId: integer('player_id').references(() => player.id),
	achievementId: integer('achievement_id').references(() => achievement.id),
	achievedAt: timestamp('achieved_at').defaultNow()
});

export const logEntry = pgTable('log_entry', {
	id: serial('id').primaryKey(),
	playerId: integer('player_id').references(() => player.id),
	message: text('message').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	category: text('category')
});

export type Session = typeof session.$inferSelect;
export type Player = typeof player.$inferSelect;
export type Resource = typeof resource.$inferSelect;
export type PlayerResource = typeof playerResource.$inferSelect;
export type Region = typeof region.$inferSelect;
export type Event = typeof event.$inferSelect;
export type CombatEncounter = typeof combatEncounter.$inferSelect;
export type Item = typeof item.$inferSelect;
export type PlayerItem = typeof playerItem.$inferSelect;