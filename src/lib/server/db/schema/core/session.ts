import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user';

export const session = pgTable('session', {
    id: text('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => user.id),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});
