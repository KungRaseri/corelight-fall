import { db } from '$lib/server/db';
import { item } from '$lib/server/db/schema/gameplay/item';
import { asc } from 'drizzle-orm';

export const load = async () => {
	const items = await db.select().from(item).orderBy(asc(item.name));

	return {
		items
	};
};
