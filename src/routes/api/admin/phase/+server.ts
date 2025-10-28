import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { phase } from '$lib/server/db/schema/story/phase';

export async function POST({ request }) {
	const data = await request.json();
	delete data.id;

	const inserted = await db.insert(phase).values(data).returning();
	return json({ phase: inserted[0] });
}

export async function GET() {
	const phases = await db.select().from(phase);
	return json({ phases });
}
