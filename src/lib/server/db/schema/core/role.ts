// src/lib/server/db/schema/core/role.ts
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const role = pgTable('role', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description').notNull()
});
