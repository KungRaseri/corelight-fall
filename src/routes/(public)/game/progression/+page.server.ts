import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { character } from '$lib/server/db/schema/gameplay/character';
import { eq } from 'drizzle-orm';
import { requireSession } from '$lib/utils/requireSession';

export const load: PageServerLoad = async ({ locals }) => {
	const session = requireSession(locals);

	const [userCharacter] = await db
		.select()
		.from(character)
		.where(eq(character.userId, session.user.id))
		.limit(1);

	return {
		character: userCharacter || null,
	};
};
