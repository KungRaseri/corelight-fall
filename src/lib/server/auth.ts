import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import type { User, Session } from './db/types';
import { session } from './db/schema/core/session';
import { user } from './db/schema/core/user';
import type { SafeUser } from '$lib/types/SafeUser';
import { sanitizeUserData } from '$lib/utils/sanitizer';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createSession(token: string, userId: number) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const sessionObject: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(session).values(sessionObject);
	return sessionObject;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	// Fetch session and user from the database
	const [result] = await db
		.select({
			userData: user, // Select all fields from the user table
			sessionData: session // Select all fields from the session table
		})
		.from(session)
		.innerJoin(user, eq(session.userId, user.id))
		.where(eq(session.id, sessionId));

	// Return nulls if no valid result is found
	if (!result) {
		return { session: null, user: null, userResource: null };
	}

	// Destructure the result using distinct names
	const { sessionData, userData }: { sessionData: Session, userData: User } = result;

	// Check if the session is expired
	const sessionExpired = Date.now() >= sessionData.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(session).where(eq(session.id, sessionData.id));
		return { session: null, user: null, userResource: null };
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

	const safeUserData: SafeUser = sanitizeUserData(userData);

	// Return the session and user data
	return { session: sessionData, user: safeUserData };
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
