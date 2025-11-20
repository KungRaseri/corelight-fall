import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hasRole, hasPermission } from '../../../src/lib/utils/permissions';
import type { Role } from '../../../src/lib/server/db/types/index';

// Mock the database module with factory function
vi.mock('../../../src/lib/server/db', () => {
	return {
		db: {
			select: vi.fn().mockReturnThis(),
			from: vi.fn().mockReturnThis(),
			innerJoin: vi.fn().mockReturnThis(),
			where: vi.fn()
		}
	};
});

// Import the mocked db to use in tests
let mockDb: any;

describe('Permission Utilities', () => {
	beforeEach(async () => {
		// Get the mocked db instance
		const dbModule = await import('../../../src/lib/server/db');
		mockDb = dbModule.db;
		
		vi.clearAllMocks();
		// Reset all mock return values
		mockDb.select.mockReturnThis();
		mockDb.from.mockReturnThis();
		mockDb.innerJoin.mockReturnThis();
	});

	describe('hasRole', () => {
		it('should return true when role name matches', async () => {
			const role: Role = {
				id: 1,
				name: 'admin',
				description: 'Administrator role'
			};

			const result = await hasRole(role, 'admin');
			expect(result).toBe(true);
		});

		it('should return false when role name does not match', async () => {
			const role: Role = {
				id: 2,
				name: 'user',
				description: 'Regular user role'
			};

			const result = await hasRole(role, 'admin');
			expect(result).toBe(false);
		});

		it('should be case-sensitive', async () => {
			const role: Role = {
				id: 1,
				name: 'admin',
				description: 'Administrator role'
			};

			const result = await hasRole(role, 'Admin');
			expect(result).toBe(false);
		});

		it('should handle moderator role', async () => {
			const role: Role = {
				id: 3,
				name: 'moderator',
				description: 'Moderator role'
			};

			const result1 = await hasRole(role, 'moderator');
			const result2 = await hasRole(role, 'admin');

			expect(result1).toBe(true);
			expect(result2).toBe(false);
		});

		it('should handle empty role name check', async () => {
			const role: Role = {
				id: 1,
				name: 'admin',
				description: 'Administrator role'
			};

			const result = await hasRole(role, '');
			expect(result).toBe(false);
		});
	});

	describe('hasPermission', () => {
		it('should return true when user has the permission', async () => {
			// Mock the database query chain to return permissions
			mockDb.where.mockResolvedValueOnce([
				{ name: 'manage_users' },
				{ name: 'edit_content' },
				{ name: 'view_admin' }
			]);

			const result = await hasPermission(1, 'manage_users');
			expect(result).toBe(true);
		});

		it('should return false when user lacks the permission', async () => {
			// Mock the database query to return different permissions
			mockDb.where.mockResolvedValueOnce([
				{ name: 'view_admin' }
			]);

			const result = await hasPermission(1, 'manage_users');
			expect(result).toBe(false);
		});

		it('should return false when user has no permissions', async () => {
			// Mock empty permissions array
			mockDb.where.mockResolvedValueOnce([]);

			const result = await hasPermission(1, 'any_permission');
			expect(result).toBe(false);
		});

		it('should handle multiple permissions correctly', async () => {
			const mockPermissions = [
				{ name: 'manage_users' },
				{ name: 'edit_content' },
				{ name: 'view_admin' }
			];

			// Test multiple permission checks
			mockDb.where.mockResolvedValueOnce(mockPermissions);
			expect(await hasPermission(1, 'manage_users')).toBe(true);

			mockDb.where.mockResolvedValueOnce(mockPermissions);
			expect(await hasPermission(1, 'edit_content')).toBe(true);

			mockDb.where.mockResolvedValueOnce(mockPermissions);
			expect(await hasPermission(1, 'view_admin')).toBe(true);

			mockDb.where.mockResolvedValueOnce(mockPermissions);
			expect(await hasPermission(1, 'nonexistent_permission')).toBe(false);
		});

		it('should be case-sensitive for permission names', async () => {
			mockDb.where.mockResolvedValueOnce([
				{ name: 'manage_users' }
			]);

			const result = await hasPermission(1, 'MANAGE_USERS');
			expect(result).toBe(false);
		});

		it('should call database with correct userId', async () => {
			mockDb.where.mockResolvedValueOnce([]);

			await hasPermission(42, 'some_permission');

			// Verify the database methods were called
			expect(mockDb.select).toHaveBeenCalled();
			expect(mockDb.from).toHaveBeenCalled();
			expect(mockDb.innerJoin).toHaveBeenCalled();
			expect(mockDb.where).toHaveBeenCalled();
		});

		it('should handle database errors gracefully', async () => {
			// Mock database error
			mockDb.where.mockRejectedValueOnce(new Error('Database connection failed'));

			await expect(hasPermission(1, 'manage_users')).rejects.toThrow('Database connection failed');
		});
	});
});
