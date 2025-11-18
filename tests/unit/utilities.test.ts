import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Example of testing utility functions or helpers
describe('Utility Functions', () => {
	describe('String Utilities', () => {
		it('should capitalize first letter', () => {
			const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
			
			expect(capitalize('hello')).toBe('Hello');
			expect(capitalize('world')).toBe('World');
		});

		it('should trim whitespace', () => {
			expect('  hello  '.trim()).toBe('hello');
		});
	});

	describe('Array Utilities', () => {
		let testArray: number[];

		beforeEach(() => {
			testArray = [1, 2, 3, 4, 5];
		});

		it('should filter even numbers', () => {
			const evenNumbers = testArray.filter(n => n % 2 === 0);
			expect(evenNumbers).toEqual([2, 4]);
		});

		it('should map to double values', () => {
			const doubled = testArray.map(n => n * 2);
			expect(doubled).toEqual([2, 4, 6, 8, 10]);
		});
	});

	describe('Object Utilities', () => {
		it('should check object properties', () => {
			const user = {
				id: 1,
				username: 'testuser',
				email: 'test@example.com'
			};

			expect(user).toHaveProperty('id');
			expect(user).toHaveProperty('username', 'testuser');
			expect(user.email).toContain('@');
		});
	});
});
