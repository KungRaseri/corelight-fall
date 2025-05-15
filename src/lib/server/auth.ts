import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import type { Player, Session } from './db/types';
import { session } from './db/schema/core/session';
import { player } from './db/schema/core/user';
import type { SafePlayer } from '$lib/types/safe';
import { sanitizePlayerData } from '$lib/utils/sanitizer';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createSession(token: string, playerId: number) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const sessionObject: Session = {
		id: sessionId,
		playerId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(session).values(sessionObject);
	return sessionObject;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	// Fetch session and player from the database
	const [result] = await db
		.select({
			playerData: player, // Select all fields from the player table
			sessionData: session // Select all fields from the session table
		})
		.from(session)
		.innerJoin(player, eq(session.playerId, player.id))
		.where(eq(session.id, sessionId));

	// Return nulls if no valid result is found
	if (!result) {
		return { session: null, player: null, playerResource: null };
	}

	// Destructure the result using distinct names
	const { sessionData, playerData }: { sessionData: Session, playerData: Player } = result;

	// Check if the session is expired
	const sessionExpired = Date.now() >= sessionData.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(session).where(eq(session.id, sessionData.id));
		return { session: null, player: null, playerResource: null };
	}

	// Renew session if close to expiration (15 days)
	const renewSession = Date.now() >= sessionData.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		sessionData.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(session)
			.set({ expiresAt: sessionData.expiresAt })
			.where(eq(session.id, sessionData.id));
	}

	const safePlayerData: SafePlayer = sanitizePlayerData(playerData);

	// Return the session and player data
	return { session: sessionData, player: safePlayerData };
}


export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await db.delete(session).where(eq(session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}
