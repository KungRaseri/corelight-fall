import { describe, it, expect } from 'vitest';
import { sanitizeUserData } from '../../../src/lib/utils/sanitizer';

describe('Sanitizer Utilities', () => {
	describe('sanitizeUserData', () => {
		it('should remove passwordHash from user data', () => {
			const userData = {
				id: 1,
				username: 'testuser',
				email: 'test@example.com',
				passwordHash: 'super-secret-hash',
				isAdmin: false,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const result = sanitizeUserData(userData);
			
			expect(result).not.toHaveProperty('passwordHash');
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('username');
			expect(result).toHaveProperty('email');
		});

		it('should preserve all other user properties', () => {
			const userData = {
				id: 42,
				username: 'hero',
				email: 'hero@example.com',
				passwordHash: 'secret',
				isAdmin: true,
				createdAt: new Date('2025-01-01'),
				updatedAt: new Date('2025-01-15')
			};

			const result = sanitizeUserData(userData);
			
			expect(result.id).toBe(42);
			expect(result.username).toBe('hero');
			expect(result.email).toBe('hero@example.com');
			expect(result.isAdmin).toBe(true);
			expect(result.createdAt).toEqual(userData.createdAt);
			expect(result.updatedAt).toEqual(userData.updatedAt);
		});

		it('should handle user without admin flag', () => {
			const userData = {
				id: 1,
				username: 'normaluser',
				email: 'user@example.com',
				passwordHash: 'hash',
				isAdmin: false,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const result = sanitizeUserData(userData);
			
			expect(result.isAdmin).toBe(false);
			expect(result).not.toHaveProperty('passwordHash');
		});

		it('should return SafeUser type (no passwordHash property)', () => {
			const userData = {
				id: 1,
				username: 'test',
				email: 'test@test.com',
				passwordHash: 'should-be-removed',
				isAdmin: false,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const result = sanitizeUserData(userData);
			
			// Type assertion test - if this compiles, the type is correct
			const safeUser: {
				id: number;
				username: string;
				email: string;
				isAdmin: boolean;
				createdAt: Date;
				updatedAt: Date;
			} = result;
			
			expect(safeUser).toBeDefined();
		});
	});
});
