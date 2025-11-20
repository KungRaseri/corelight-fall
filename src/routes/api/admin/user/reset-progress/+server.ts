import { db } from '$lib/server/db';
import { playerStoryProgress } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/utils/requireAdmin';

export const POST: RequestHandler = async ({ locals, request }) => {
	await requireAdmin(locals);

	const { userId } = await request.json();

	if (!userId || typeof userId !== 'number') {
		error(400, 'Invalid user ID');
	}

	// Delete all story progress for this user
	await db.delete(playerStoryProgress).where(eq(playerStoryProgress.userId, userId));

	return json({ success: true, message: 'Story progress reset successfully' });
};
