import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { user, setUser, clearUser } from '../../../src/lib/stores/user.js';

describe('User Store', () => {
	beforeEach(() => {
		// Reset user store before each test
		user.set(null);
	});

	it('should initialize as undefined', () => {
		const currentUser = get(user);
		expect(currentUser).toBeNull();
	});

	it('should be a writable store', () => {
		const testUser = {
			id: 1,
			email: 'test@example.com',
			username: 'testuser',
			role: 'user' as const,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		user.set(testUser);
		expect(get(user)).toEqual(testUser);
	});

	it('should be subscribable', () => {
		let currentUser;
		const unsubscribe = user.subscribe((value) => {
			currentUser = value;
		});

		expect(currentUser).toBeNull();

		const testUser = {
			id: 1,
			email: 'test@example.com',
			username: 'testuser',
			role: 'user' as const,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		user.set(testUser);
		expect(currentUser).toEqual(testUser);

		unsubscribe();
	});

	describe('setUser', () => {
		it('should set user data', () => {
			const testUser = {
				id: 99,
				email: 'admin@example.com',
				username: 'admin',
				role: 'admin' as const,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			setUser(testUser);

			const currentUser = get(user);
			expect(currentUser).toEqual(testUser);
			expect(currentUser?.id).toBe(99);
			expect(currentUser?.role).toBe('admin');
		});

		it('should allow setting user to null', () => {
			const testUser = {
				id: 1,
				email: 'test@example.com',
				username: 'testuser',
				role: 'user' as const,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			setUser(testUser);
			expect(get(user)).not.toBeNull();

			setUser(null);
			expect(get(user)).toBeNull();
		});

		it('should overwrite previous user', () => {
			const firstUser = {
				id: 1,
				email: 'first@example.com',
				username: 'first',
				role: 'user' as const,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const secondUser = {
				id: 2,
				email: 'second@example.com',
				username: 'second',
				role: 'admin' as const,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			setUser(firstUser);
			expect(get(user)?.username).toBe('first');

			setUser(secondUser);
			expect(get(user)?.username).toBe('second');
			expect(get(user)?.id).toBe(2);
		});

		it('should handle different user roles', () => {
			const regularUser = {
				id: 1,
				email: 'user@example.com',
				username: 'user',
				role: 'user' as const,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const adminUser = {
				id: 2,
				email: 'admin@example.com',
				username: 'admin',
				role: 'admin' as const,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			setUser(regularUser);
			expect(get(user)?.role).toBe('user');

			setUser(adminUser);
			expect(get(user)?.role).toBe('admin');
		});
	});

	describe('clearUser', () => {
		it('should set user to null', () => {
			const testUser = {
				id: 1,
				email: 'test@example.com',
				username: 'testuser',
				role: 'user' as const,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			setUser(testUser);
			expect(get(user)).not.toBeNull();

			clearUser();
			expect(get(user)).toBeNull();
		});

		it('should work when user is already null', () => {
			setUser(null);
			expect(() => clearUser()).not.toThrow();
			expect(get(user)).toBeNull();
		});

		it('should clear all user data', () => {
			const testUser = {
				id: 1,
				email: 'test@example.com',
				username: 'testuser',
				role: 'admin' as const,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			setUser(testUser);
			clearUser();

			const currentUser = get(user);
			expect(currentUser).toBeNull();
		});
	});

	describe('integration scenarios', () => {
		it('should handle login/logout flow', () => {
			// Start logged out
			expect(get(user)).toBeNull();

			// Login
			const loggedInUser = {
				id: 1,
				email: 'test@example.com',
				username: 'testuser',
				role: 'user' as const,
				createdAt: new Date(),
				updatedAt: new Date()
			};
			setUser(loggedInUser);
			expect(get(user)).toEqual(loggedInUser);

			// Logout
			clearUser();
			expect(get(user)).toBeNull();
		});

		it('should handle user switching', () => {
			const user1 = {
				id: 1,
				email: 'user1@example.com',
				username: 'user1',
				role: 'user' as const,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const user2 = {
				id: 2,
				email: 'user2@example.com',
				username: 'user2',
				role: 'admin' as const,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			setUser(user1);
			expect(get(user)?.id).toBe(1);

			clearUser();
			expect(get(user)).toBeNull();

			setUser(user2);
			expect(get(user)?.id).toBe(2);
		});
	});
});
