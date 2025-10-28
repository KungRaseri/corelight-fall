import { db } from '$lib/server/db';
import { role, user, userRole } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const users = await db
			.select({
				id: user.id,
				username: user.username,
				createdAt: user.createdAt,
				roleName: role.name
			})
			.from(user)
			.leftJoin(userRole, eq(userRole.userId, user.id))
			.leftJoin(role, eq(userRole.roleId, role.id));

		return { users };
	} catch (error) {
		console.error('Error loading users:', error);
		return { users: [] };
	}
};
