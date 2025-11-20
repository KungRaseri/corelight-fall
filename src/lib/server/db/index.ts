import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema'; // Now correctly referencing the index.ts in schema

// Use process.env for standalone scripts, or import from SvelteKit env when available
let DATABASE_URL: string | undefined;
try {
	// Try to use SvelteKit env in runtime
	const { env } = await import('$env/dynamic/private');
	DATABASE_URL = env.DATABASE_URL;
} catch {
	// Fall back to process.env for standalone scripts (like seed.ts)
	DATABASE_URL = process.env.DATABASE_URL;
}

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(DATABASE_URL);
export const db = drizzle(client, { schema });
