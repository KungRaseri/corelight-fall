import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const player = pgTable('player', {
    id: serial('id').primaryKey(),
    username: text('username').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow()
});
