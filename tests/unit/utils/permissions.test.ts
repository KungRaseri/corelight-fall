import { describe, it, expect } from 'vitest';
import { hasPermission, requirePermission } from '$lib/utils/permissions';

describe('Permission Utilities', () => {
	const mockUserWithAdmin = {
		id: 1,
		username: 'admin',
		roles: [
			{
				role: {
					permissions: [
						{ permission: { name: 'admin:read' } },
						{ permission: { name: 'admin:write' } },
						{ permission: { name: 'user:manage' } }
					]
				}
			}
		]
	};

	const mockUserWithoutAdmin = {
		id: 2,
		username: 'player',
		roles: [
			{
				role: {
					permissions: [
						{ permission: { name: 'game:play' } },
						{ permission: { name: 'character:create' } }
					]
				}
			}
		]
	};

	const mockUserNoRoles = {
		id: 3,
		username: 'noroles',
		roles: []
	};

	describe('hasPermission', () => {
		it('should return true when user has the permission', () => {
			const result = hasPermission(mockUserWithAdmin, 'admin:read');
			expect(result).toBe(true);
		});

		it('should return false when user lacks the permission', () => {
			const result = hasPermission(mockUserWithoutAdmin, 'admin:write');
			expect(result).toBe(false);
		});

		it('should return false for user with no roles', () => {
			const result = hasPermission(mockUserNoRoles, 'any:permission');
			expect(result).toBe(false);
		});

		it('should return false for null user', () => {
			const result = hasPermission(null, 'any:permission');
			expect(result).toBe(false);
		});

		it('should return false for undefined user', () => {
			const result = hasPermission(undefined, 'any:permission');
			expect(result).toBe(false);
		});

		it('should handle multiple permissions correctly', () => {
			expect(hasPermission(mockUserWithAdmin, 'admin:read')).toBe(true);
			expect(hasPermission(mockUserWithAdmin, 'admin:write')).toBe(true);
			expect(hasPermission(mockUserWithAdmin, 'user:manage')).toBe(true);
			expect(hasPermission(mockUserWithAdmin, 'nonexistent:perm')).toBe(false);
		});

		it('should be case-sensitive', () => {
			const result = hasPermission(mockUserWithAdmin, 'ADMIN:READ');
			expect(result).toBe(false); // Should not match 'admin:read'
		});
	});

	describe('requirePermission', () => {
		it('should not throw when user has permission', () => {
			expect(() => {
				requirePermission(mockUserWithAdmin, 'admin:read');
			}).not.toThrow();
		});

		it('should throw when user lacks permission', () => {
			expect(() => {
				requirePermission(mockUserWithoutAdmin, 'admin:write');
			}).toThrow();
		});

		it('should throw with appropriate error message', () => {
			expect(() => {
				requirePermission(mockUserWithoutAdmin, 'admin:write');
			}).toThrow(/permission|forbidden|access/i);
		});

		it('should throw for null user', () => {
			expect(() => {
				requirePermission(null, 'any:permission');
			}).toThrow();
		});

		it('should throw for user with no roles', () => {
			expect(() => {
				requirePermission(mockUserNoRoles, 'any:permission');
			}).toThrow();
		});
	});
});
