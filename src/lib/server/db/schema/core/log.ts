import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user';

export const logEntry = pgTable('log_entry', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => user.id),
    message: text('message').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    category: text('category')
});
