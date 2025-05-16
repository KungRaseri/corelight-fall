import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import { attribute, characterAttribute } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const attributes = await db
		.select({
			attribute: {
				id: attribute.id,
				name: attribute.name,
				description: attribute.description,
				category: attribute.category,
				baseValue: attribute.baseValue,
				scaling: attribute.scaling,
			},
			characterAttribute: {
				characterId: characterAttribute.characterId,
				attributeId: characterAttribute.attributeId,
				value: characterAttribute.value
			}
		})
		.from(characterAttribute)
		.innerJoin(attribute, eq(characterAttribute.attributeId, attribute.id))
		.where(eq(characterAttribute.characterId, locals.character.id));

	return { user: locals.user, attributes };
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
