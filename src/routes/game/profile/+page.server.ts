import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || !locals.playerData) {
		return redirect(302, '/auth/login');
	}

	return {
		user: locals.user,
		playerData: locals.playerData
	};
};