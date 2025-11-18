import { hash } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { NewUser } from '$lib/server/db/types';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
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
			return fail(400, {
				message: 'Username must be 3-31 characters (alphanumeric, hyphen, underscore).'
			});
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Password must be 6-255 characters.' });
		}

		// Check for existing user
		const existingUser = await db
			.select()
			.from(table.user)
			.where(eq(table.user.username, username));
		if (existingUser.length > 0) {
			return fail(409, { message: 'Username already taken.' });
		}

		// Hash the password securely
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		// Insert new user into the database
		try {
			const newUser: NewUser = { 
				username, 
				passwordHash 
			};
			
			const user = await db.insert(table.user).values(newUser).returning();
			if (!user || user.length === 0) {
				return fail(500, { message: 'Error creating user. Please try again later.' });
			}

			// Create session
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, user[0].id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			console.error('Registration error:', e);
			return fail(500, { message: 'An error has occurred' });
		}
		return redirect(302, '/onboarding');
	}
};

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
