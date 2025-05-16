import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { attribute, characterAttribute } from '$lib/server/db/schema';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	if (!locals.character) {
		throw redirect(302, '/onboarding');
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