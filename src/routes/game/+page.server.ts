import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import { stat } from '$lib/server/db/schema/gameplay/stat';
import { playerStat } from '$lib/server/db/schema/gameplay/playerStat';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.player) {
		throw redirect(302, '/auth/login');
	}

	const stats = await db
		.select({
			stat: {
				id: stat.id,
				name: stat.name,
				description: stat.description,
				category: stat.category,
				baseValue: stat.baseValue,
				scaling: stat.scaling,
			},
			playerStat: {
				playerId: playerStat.playerId,
				statId: playerStat.statId,
				value: playerStat.value
			}
		})
		.from(playerStat)
		.innerJoin(stat, eq(playerStat.statId, stat.id))
		.where(eq(playerStat.playerId, locals.player.id));

	return { player: locals.player, stats };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}

		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/auth/login');
	}
};
