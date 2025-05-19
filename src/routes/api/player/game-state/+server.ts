import { db } from '$lib/server/db';
import { playerGameState } from '$lib/server/db/schema/gameplay/playerGameState';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET = async ({ locals }) => {
    const userId = locals.user?.id;
    if (!userId) return json({ error: 'Not authenticated' }, { status: 401 });

    const state = await db.select().from(playerGameState).where(eq(playerGameState.userId, userId)).limit(1);
    return json(state[0] ?? null);
};

export const POST = async ({ request, locals }) => {
    const userId = locals.user?.id;
    if (!userId) return json({ error: 'Not authenticated' }, { status: 401 });

    const data = await request.json();
    const now = Date.now();

    // Upsert logic (simplified)
    await db
        .insert(playerGameState)
        .values({ ...data, userId, updatedAt: now })
        .onConflictDoUpdate({
            target: playerGameState.userId,
            set: { ...data, updatedAt: now }
        });

    return json({ success: true });
};