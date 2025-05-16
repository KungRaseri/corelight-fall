import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
    if (!locals.user) {
        return { status: 401, error: new Error('Unauthorized') };
    }

    // Fetch attributes and factions from your API or DB
    const [attributesRes, factionsRes] = await Promise.all([
        fetch('/api/game/attributes'),
        fetch('/api/game/factions')
    ]);
    const attributes = await attributesRes.json();
    const factions = await factionsRes.json();

    return { attributes, factions };
};