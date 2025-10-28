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

export const character = pgTable('character', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	appearance: text('appearance'),
	tutorial: boolean('tutorial').default(false),
	onboarding: boolean('onboarding').default(false),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});
