import { db } from '$lib/server/db';
import { permission, role, rolePermission, userRole } from '$lib/server/db/schema';
import type { Role } from '$lib/server/db/types';
import { eq } from 'drizzle-orm';

export async function hasRole(userRole: Role, roleName: string): Promise<boolean> {
	return userRole.name === roleName;
}

export async function hasPermission(userId: number, permissionName: string): Promise<boolean> {
	const permissions = await db
		.select({ name: permission.name })
		.from(userRole)
		.innerJoin(role, eq(role.id, userRole.roleId))
		.innerJoin(rolePermission, eq(rolePermission.roleId, role.id))
		.innerJoin(permission, eq(permission.id, rolePermission.permissionId))
		.where(eq(userRole.userId, userId));

	return permissions.some((p) => p.name === permissionName);
}
