import { db } from '$lib/server/db';
import { item } from '$lib/server/db/schema/gameplay/item';
import type { NewItem, Item } from '$lib/server/db/types';
import { requireAdmin } from '$lib/utils/requireAdmin';
import { json } from '@sveltejs/kit';
import { eq, asc } from 'drizzle-orm';

export const GET = async ({ locals }) => {
	requireAdmin(locals);
	const items = await db.select().from(item).orderBy(asc(item.name));
	return json(items);
};

export const POST = async ({ locals, request }) => {
	requireAdmin(locals);
	const data = await request.json();

	// Create a properly typed insert object
	const newItem: NewItem = {
		name: data.name,
		type: data.type,
		description: data.description
	};

	const result = await db.insert(item).values(newItem).returning();
	return json({ success: true, item: result[0] });
};

export const PUT = async ({ locals, request }) => {
	requireAdmin(locals);
	const data = await request.json();
	
	const updateData: Partial<Item> = {
		name: data.name,
		type: data.type,
		description: data.description
	};

	const result = await db.update(item).set(updateData).where(eq(item.id, data.id)).returning();
	return json({ success: true, item: result[0] });
};

export const DELETE = async ({ locals, request }) => {
	requireAdmin(locals);
	const { id } = await request.json();
	
	await db.delete(item).where(eq(item.id, id));
	return json({ success: true });
};
