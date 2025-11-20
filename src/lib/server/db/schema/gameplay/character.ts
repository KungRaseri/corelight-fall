import {
	pgTable,
	serial,
	text,
	integer,
	foreignKey,
	boolean,
	timestamp
} from 'drizzle-orm/pg-core';
import { user } from '../core/user';
import { faction } from '../social/faction';

export const character = pgTable('character', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	appearance: text('appearance'),
	background: text('background'),
	factionId: integer('faction_id').references(() => faction.id),
	
	// Progression
	level: integer('level').notNull().default(1),
	xp: integer('xp').notNull().default(0),
	
	// Health
	hp: integer('hp').notNull().default(100),
	maxHp: integer('max_hp').notNull().default(100),
	
	// Resources
	gold: integer('gold').notNull().default(0),
	
	// Flags
	tutorial: boolean('tutorial').default(false),
	onboarding: boolean('onboarding').default(false),
	
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});
