import { describe, it, expect } from 'vitest';

describe('Sample Unit Test', () => {
	it('should perform basic arithmetic', () => {
		expect(1 + 1).toBe(2);
	});

	it('should work with strings', () => {
		expect('hello' + ' ' + 'world').toBe('hello world');
	});
});
