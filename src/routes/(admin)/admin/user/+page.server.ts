import { db } from '$lib/server/db';
import { role, user, userRole } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const usersWithRoles = await db
			.select({
				id: user.id,
				username: user.username,
				createdAt: user.createdAt,
				roleName: role.name
			})
			.from(user)
			.leftJoin(userRole, eq(userRole.userId, user.id))
			.leftJoin(role, eq(userRole.roleId, role.id));

		// Deduplicate users and combine their roles
		const userMap = new Map<number, {
			id: number;
			username: string;
			createdAt: Date | null;
			roleName: string;
		}>();

		for (const userWithRole of usersWithRoles) {
			if (userMap.has(userWithRole.id)) {
				// If user already exists, append the role name
				const existingUser = userMap.get(userWithRole.id)!;
				if (userWithRole.roleName && !existingUser.roleName.includes(userWithRole.roleName)) {
					existingUser.roleName = existingUser.roleName === 'None' 
						? userWithRole.roleName 
						: `${existingUser.roleName}, ${userWithRole.roleName}`;
				}
			} else {
				// Add new user to map
				userMap.set(userWithRole.id, {
					id: userWithRole.id,
					username: userWithRole.username,
					createdAt: userWithRole.createdAt,
					roleName: userWithRole.roleName || 'None'
				});
			}
		}

		const users = Array.from(userMap.values());

		return { users };
	} catch (error) {
		console.error('Error loading users:', error);
		return { users: [] };
	}
};
