import { describe, it, expect, vi } from 'vitest';
import { requireSession } from '../../../src/lib/utils/requireSession';

// Mock SvelteKit error function
vi.mock('@sveltejs/kit', () => ({
	error: (status: number, message: string) => {
		const err = new Error(message) as Error & { status: number };
		err.status = status;
		return err;
	}
}));

describe('requireSession', () => {
	describe('authentication checks', () => {
		it('should throw 401 error when user is not authenticated', async () => {
			const locals = {
				user: null,
				session: { id: 'session-123' }
			} as unknown as App.Locals;

			await expect(requireSession(locals)).rejects.toMatchObject({
				status: 401,
				message: 'Not authenticated'
			});
		});

		it('should throw 401 error when session is missing', async () => {
			const locals = {
				user: { id: 1, username: 'test', email: 'test@example.com' },
				session: null
			} as unknown as App.Locals;

			await expect(requireSession(locals)).rejects.toMatchObject({
				status: 401,
				message: 'Not authenticated'
			});
		});

		it('should throw 401 error when both user and session are missing', async () => {
			const locals = {
				user: null,
				session: null
			} as unknown as App.Locals;

			await expect(requireSession(locals)).rejects.toMatchObject({
				status: 401,
				message: 'Not authenticated'
			});
		});

		it('should throw 401 error when user is undefined', async () => {
			const locals = {
				user: undefined,
				session: { id: 'session-123' }
			} as unknown as App.Locals;

			await expect(requireSession(locals)).rejects.toMatchObject({
				status: 401,
				message: 'Not authenticated'
			});
		});

		it('should throw 401 error when session is undefined', async () => {
			const locals = {
				user: { id: 1, username: 'test', email: 'test@example.com' },
				session: undefined
			} as unknown as App.Locals;

			await expect(requireSession(locals)).rejects.toMatchObject({
				status: 401,
				message: 'Not authenticated'
			});
		});
	});

	describe('successful authentication', () => {
		it('should return true when both user and session exist', async () => {
			const locals = {
				user: { id: 1, username: 'player', email: 'player@example.com' },
				session: { id: 'session-123', userId: 1 }
			} as unknown as App.Locals;

			const result = await requireSession(locals);
			expect(result).toBe(true);
		});

		it('should accept user with all properties', async () => {
			const locals = {
				user: {
					id: 1,
					username: 'player',
					email: 'player@example.com',
					isAdmin: false,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				session: {
					id: 'session-123',
					userId: 1,
					expiresAt: new Date(Date.now() + 86400000)
				}
			} as unknown as App.Locals;

			const result = await requireSession(locals);
			expect(result).toBe(true);
		});

		it('should accept admin user with session', async () => {
			const locals = {
				user: {
					id: 1,
					username: 'admin',
					email: 'admin@example.com',
					isAdmin: true
				},
				session: { id: 'admin-session-456' }
			} as unknown as App.Locals;

			const result = await requireSession(locals);
			expect(result).toBe(true);
		});
	});

	describe('edge cases', () => {
		it('should not accept empty user object', async () => {
			const locals = {
				user: {},
				session: { id: 'session-123' }
			} as unknown as App.Locals;

			// Empty object is truthy, so this should pass
			const result = await requireSession(locals);
			expect(result).toBe(true);
		});

		it('should not accept empty session object', async () => {
			const locals = {
				user: { id: 1, username: 'test', email: 'test@example.com' },
				session: {}
			} as unknown as App.Locals;

			// Empty object is truthy, so this should pass
			const result = await requireSession(locals);
			expect(result).toBe(true);
		});

		it('should reject falsy user values (0, empty string, false)', async () => {
			const testCases = [0, '', false];

			for (const falsyValue of testCases) {
				const locals = {
					user: falsyValue,
					session: { id: 'session-123' }
				} as unknown as App.Locals;

				await expect(requireSession(locals)).rejects.toMatchObject({
					status: 401,
					message: 'Not authenticated'
				});
			}
		});

		it('should reject falsy session values (0, empty string, false)', async () => {
			const testCases = [0, '', false];

			for (const falsyValue of testCases) {
				const locals = {
					user: { id: 1, username: 'test', email: 'test@example.com' },
					session: falsyValue
				} as unknown as App.Locals;

				await expect(requireSession(locals)).rejects.toMatchObject({
					status: 401,
					message: 'Not authenticated'
				});
			}
		});
	});

	describe('integration scenarios', () => {
		it('should validate session for protected routes', async () => {
			const locals = {
				user: { id: 5, username: 'player5', email: 'player5@example.com' },
				session: { id: 'valid-session', userId: 5 }
			} as unknown as App.Locals;

			const result = await requireSession(locals);
			expect(result).toBe(true);
		});

		it('should reject requests without session', async () => {
			const locals = {
				user: { id: 1, username: 'player', email: 'player@example.com' },
				session: null
			} as unknown as App.Locals;

			await expect(requireSession(locals)).rejects.toMatchObject({
				status: 401,
				message: 'Not authenticated'
			});
		});

		it('should reject requests without user even if session exists', async () => {
			const locals = {
				user: null,
				session: { id: 'orphaned-session' }
			} as unknown as App.Locals;

			await expect(requireSession(locals)).rejects.toMatchObject({
				status: 401,
				message: 'Not authenticated'
			});
		});
	});
});
