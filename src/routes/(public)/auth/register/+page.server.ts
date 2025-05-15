import { hash } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.player) {
		throw redirect(302, '/game');
	}
	return {};
};

export const actions: Actions = {
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		// Validate input
		if (!validateUsername(username)) {
			return fail(400, { message: 'Username must be 3-31 characters (alphanumeric, hyphen, underscore).' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Password must be 6-255 characters.' });
		}

		// Check for existing user
		const existingUser = await db.select().from(table.player).where(eq(table.player.username, username));
		if (existingUser.length > 0) {
			return fail(409, { message: 'Username already taken.' });
		}

		// Generate user ID
		const userId = generateUserId();

		// Hash the password securely
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		// Insert new player into the database
		try {
			const player = await db.insert(table.player).values({ username, passwordHash }).returning();
			if (!player || player.length === 0) {
				return fail(500, { message: 'Error creating user. Please try again later.' });
			}

			// Create session
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, player[0].id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			return fail(500, { message: 'An error has occurred' });
		}
		return redirect(302, '/onboarding');
	}
};

// Helper function to generate a unique user ID
function generateUserId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}

// Validate username (alphanumeric, hyphen, underscore, 3-31 chars)
function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

// Validate password (6-255 characters)
function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
