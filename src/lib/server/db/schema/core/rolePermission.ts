// src/lib/server/db/schema/core/rolePermission.ts
import { pgTable, integer, serial, primaryKey } from 'drizzle-orm/pg-core';
import { role } from './role';
import { permission } from './permission';

export const rolePermission = pgTable(
	'role_permission',
	{
		roleId: integer('role_id')
			.references(() => role.id)
			.notNull(),
		permissionId: integer('permission_id')
			.references(() => permission.id)
			.notNull()
	},
	(table) => [
		primaryKey({
			columns: [table.roleId, table.permissionId]
		})
	]
);
