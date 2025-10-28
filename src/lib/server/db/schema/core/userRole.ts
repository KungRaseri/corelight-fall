import { pgTable, integer } from 'drizzle-orm/pg-core';
import { role } from './role';
import { user } from './user';

export const userRole = pgTable('user_role', {
	userId: integer('user_id')
		.references(() => user.id, { onDelete: 'cascade' })
		.notNull(),
	roleId: integer('role_id')
		.references(() => role.id)
		.notNull()
});
