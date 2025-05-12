import { db } from "$lib/server/db";
import { permission, player, playerRole, role, rolePermission } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export async function hasRole(playerId: number, roleName: string): Promise<boolean> {
    const roles = await db
        .select({ name: role.name })
        .from(playerRole)
        .innerJoin(role, eq(role.id, playerRole.roleId))
        .where(eq(playerRole.playerId, playerId));

    return roles.some((r) => r.name === roleName);
} ``

export async function hasPermission(playerId: number, permissionName: string): Promise<boolean> {
    const permissions = await db
        .select({ name: permission.name })
        .from(playerRole)
        .innerJoin(role, eq(role.id, playerRole.roleId))
        .innerJoin(rolePermission, eq(rolePermission.roleId, role.id))
        .innerJoin(permission, eq(permission.id, rolePermission.permissionId))
        .where(eq(playerRole.playerId, playerId));

    return permissions.some((p) => p.name === permissionName);
}
