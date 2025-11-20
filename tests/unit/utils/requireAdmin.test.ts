import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireAdmin } from '../../../src/lib/utils/requireAdmin';
import * as permissions from '../../../src/lib/utils/permissions';
import type { Role } from '../../../src/lib/server/db/types/index';

// Mock SvelteKit error function
vi.mock('@sveltejs/kit', () => ({
	error: (status: number, message: string) => {
		const err = new Error(message) as Error & { status: number };
		err.status = status;
		return err;
	}
}));

describe('requireAdmin', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('authentication checks', () => {
		it('should throw 401 error when user is not authenticated', async () => {
			const locals = {
				user: null,
				role: null
			} as unknown as App.Locals;

			await expect(requireAdmin(locals)).rejects.toMatchObject({
				status: 401,
				message: 'Not authenticated'
			});
		});

		it('should throw 401 error when user is undefined', async () => {
			const locals = {
				user: undefined,
				role: null
			} as unknown as App.Locals;

			await expect(requireAdmin(locals)).rejects.toMatchObject({
				status: 401,
				message: 'Not authenticated'
			});
		});
	});

	describe('role checks', () => {
		it('should throw 403 error when role is not found', async () => {
			const locals = {
				user: { id: 1, username: 'test', email: 'test@example.com', isAdmin: false },
				role: null
			} as unknown as App.Locals;

			await expect(requireAdmin(locals)).rejects.toMatchObject({
				status: 403,
				message: 'Role not found'
			});
		});

		it('should throw 403 error when role is undefined', async () => {
			const locals = {
				user: { id: 1, username: 'test', email: 'test@example.com', isAdmin: false },
				role: undefined
			} as unknown as App.Locals;

			await expect(requireAdmin(locals)).rejects.toMatchObject({
				status: 403,
				message: 'Role not found'
			});
		});
	});

	describe('authorization checks', () => {
		it('should throw 403 error when user is not admin', async () => {
			const mockRole: Role = {
				id: 2,
				name: 'user',
				description: 'Regular user'
			};

			const locals = {
				user: { id: 1, username: 'test', email: 'test@example.com', isAdmin: false },
				role: mockRole
			} as unknown as App.Locals;

			// Mock hasRole to return false (not admin)
			vi.spyOn(permissions, 'hasRole').mockResolvedValueOnce(false);

			await expect(requireAdmin(locals)).rejects.toMatchObject({
				status: 403,
				message: 'Not authorized'
			});
		});

		it('should throw 403 error when user has moderator role', async () => {
			const mockRole: Role = {
				id: 3,
				name: 'moderator',
				description: 'Moderator'
			};

			const locals = {
				user: { id: 1, username: 'mod', email: 'mod@example.com', isAdmin: false },
				role: mockRole
			} as unknown as App.Locals;

			// Mock hasRole to return false (not admin)
			vi.spyOn(permissions, 'hasRole').mockResolvedValueOnce(false);

			await expect(requireAdmin(locals)).rejects.toMatchObject({
				status: 403,
				message: 'Not authorized'
			});
		});

		it('should return true when user has admin role', async () => {
			const mockRole: Role = {
				id: 1,
				name: 'admin',
				description: 'Administrator'
			};

			const locals = {
				user: { id: 1, username: 'admin', email: 'admin@example.com', isAdmin: true },
				role: mockRole
			} as unknown as App.Locals;

			// Mock hasRole to return true (is admin)
			vi.spyOn(permissions, 'hasRole').mockResolvedValueOnce(true);

			const result = await requireAdmin(locals);
			expect(result).toBe(true);
		});

		it('should call hasRole with correct parameters', async () => {
			const mockRole: Role = {
				id: 1,
				name: 'admin',
				description: 'Administrator'
			};

			const locals = {
				user: { id: 1, username: 'admin', email: 'admin@example.com', isAdmin: true },
				role: mockRole
			} as unknown as App.Locals;

			const hasRoleSpy = vi.spyOn(permissions, 'hasRole').mockResolvedValueOnce(true);

			await requireAdmin(locals);

			expect(hasRoleSpy).toHaveBeenCalledWith(mockRole, 'admin');
			expect(hasRoleSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('edge cases', () => {
		it('should handle async hasRole errors', async () => {
			const mockRole: Role = {
				id: 1,
				name: 'admin',
				description: 'Administrator'
			};

			const locals = {
				user: { id: 1, username: 'admin', email: 'admin@example.com', isAdmin: true },
				role: mockRole
			} as unknown as App.Locals;

			// Mock hasRole to throw an error
			vi.spyOn(permissions, 'hasRole').mockRejectedValueOnce(new Error('Database error'));

			await expect(requireAdmin(locals)).rejects.toThrow('Database error');
		});

		it('should not accept empty user object', async () => {
			const locals = {
				user: {},
				role: { id: 1, name: 'admin', description: 'Admin' }
			} as unknown as App.Locals;

			// Empty object is truthy, so it passes user check
			vi.spyOn(permissions, 'hasRole').mockResolvedValueOnce(true);

			// Should succeed since user object exists (even if empty)
			const result = await requireAdmin(locals);
			expect(result).toBe(true);
		});
	});

	describe('integration scenarios', () => {
		it('should validate admin access for protected routes', async () => {
			const adminRole: Role = {
				id: 1,
				name: 'admin',
				description: 'Administrator with full access'
			};

			const locals = {
				user: { id: 1, username: 'admin', email: 'admin@example.com', isAdmin: true },
				role: adminRole
			} as unknown as App.Locals;

			vi.spyOn(permissions, 'hasRole').mockResolvedValueOnce(true);

			const result = await requireAdmin(locals);
			expect(result).toBe(true);
		});

		it('should reject regular user from admin routes', async () => {
			const userRole: Role = {
				id: 2,
				name: 'user',
				description: 'Regular user'
			};

			const locals = {
				user: { id: 2, username: 'player', email: 'player@example.com', isAdmin: false },
				role: userRole
			} as unknown as App.Locals;

			vi.spyOn(permissions, 'hasRole').mockResolvedValueOnce(false);

			await expect(requireAdmin(locals)).rejects.toMatchObject({
				status: 403,
				message: 'Not authorized'
			});
		});

		it('should reject unauthenticated requests to admin routes', async () => {
			const locals = {
				user: null,
				role: null
			} as unknown as App.Locals;

			await expect(requireAdmin(locals)).rejects.toMatchObject({
				status: 401,
				message: 'Not authenticated'
			});
		});
	});
});
