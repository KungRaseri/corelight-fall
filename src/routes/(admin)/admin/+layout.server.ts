// src/routes/admin/+page.server.ts
import { db } from '$lib/server/db/index';
import {
	blogPost,
	choice,
	encounter,
	quest,
	storyline,
	user,
	userRole
} from '$lib/server/db/schema';
import { requireAdmin } from '$lib/utils/requireAdmin';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	if (!locals.user || !locals.role) {
		throw redirect(302, '/auth/login');
	}

	if (!requireAdmin(locals)) {
		throw redirect(302, '/');
	}

	const roles = await db.select().from(userRole).where(eq(userRole.userId, locals.user.id));

	const storylines = await db.$count(storyline);
	const quests = await db.$count(quest);
	const encounters = await db.$count(encounter);
	const choices = await db.$count(choice);
	const users = await db.$count(user);
	const blogPosts = await db.$count(blogPost);

	return {
		user: locals.user,
		roles,
		statsData: {
			storylines,
			quests,
			encounters,
			choices,
			blogPosts,
			users
		}
	};
};
