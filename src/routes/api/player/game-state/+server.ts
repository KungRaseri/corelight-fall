import { db } from '$lib/server/db';
import { playerGameState } from '$lib/server/db/schema/gameplay/playerGameState';
import { requireSession } from '$lib/utils/requireSession';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET = async ({ locals }) => {
	requireSession(locals);

	const state = await db
		.select()
		.from(playerGameState)
		.where(eq(playerGameState.userId, locals.user?.id ?? -1))
		.limit(1);
	return json(state[0] ?? null);
};

export const POST = async ({ request, locals }) => {
	requireSession(locals);

	const data = await request.json();
	const now = Date.now();

	// Upsert logic (simplified)
	await db
		.insert(playerGameState)
		.values({ ...data, userId: locals.user?.id ?? -1, updatedAt: now })
		.onConflictDoUpdate({
			target: playerGameState.userId,
			set: { ...data, updatedAt: now }
		});

	return json({ success: true });
};
