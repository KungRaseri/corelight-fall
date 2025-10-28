// src/lib/server/db/schema/core/permission.ts
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const permission = pgTable('permission', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(), // e.g., manage_users, edit_content
	description: text('description').notNull()
});
