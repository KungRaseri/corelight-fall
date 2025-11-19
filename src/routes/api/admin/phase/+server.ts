import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { phase } from '$lib/server/db/schema/story/phase';
import type { NewPhase } from '$lib/server/db/types';

export async function POST({ request }) {
	const data = await request.json();

	const newPhase: NewPhase = {
		actId: data.actId,
		title: data.title,
		order: data.order
	};

	const inserted = await db.insert(phase).values(newPhase).returning();
	return json({ phase: inserted[0] });
}

export async function GET() {
	const phases = await db.select().from(phase);
	return json({ phases });
}

