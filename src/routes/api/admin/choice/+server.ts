import { db } from '$lib/server/db';
import { choice } from '$lib/server/db/schema/story/choice';
import type { NewChoice, Choice } from '$lib/server/db/types';
import { requireAdmin } from '$lib/utils/requireAdmin';
import { json } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';

export const GET = async ({ locals }) => {
	requireAdmin(locals);
	const choices = await db.select().from(choice).orderBy(desc(choice.id));
	return json(choices);
};

export const POST = async ({ locals, request }) => {
	requireAdmin(locals);
	const data = await request.json();

	const newChoice: NewChoice = {
		encounterId: data.encounterId,
		text: data.text,
		outcome: data.outcome,
		nextEncounterId: data.nextEncounterId === '' ? null : data.nextEncounterId,
		order: data.order,
		createdAt: new Date(),
		updatedAt: new Date()
	};

	const result = await db.insert(choice).values(newChoice).returning();
	return json({ success: true, choice: result[0] });
};

export const PUT = async ({ locals, request }) => {
	requireAdmin(locals);
	const data = await request.json();
	
	const updateData: Partial<Choice> = {
		encounterId: data.encounterId,
		text: data.text,
		outcome: data.outcome,
		nextEncounterId: data.nextEncounterId,
		order: data.order,
		updatedAt: new Date()
	};

	const result = await db.update(choice).set(updateData).where(eq(choice.id, data.id)).returning();
	return json({ success: true, choice: result[0] });
};
