import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeInput } from '$lib/utils/sanitizer';

describe('Sanitizer Utilities', () => {
	describe('sanitizeHtml', () => {
		it('should allow safe HTML tags', () => {
			const input = '<p>This is <strong>bold</strong> and <em>italic</em></p>';
			const result = sanitizeHtml(input);
			
			expect(result).toContain('<p>');
			expect(result).toContain('<strong>');
			expect(result).toContain('<em>');
		});

		it('should remove script tags', () => {
			const input = '<p>Safe text</p><script>alert("XSS")</script>';
			const result = sanitizeHtml(input);
			
			expect(result).toContain('<p>');
			expect(result).not.toContain('<script>');
			expect(result).not.toContain('alert');
		});

		it('should remove event handlers', () => {
			const input = '<p onclick="alert(\'XSS\')">Click me</p>';
			const result = sanitizeHtml(input);
			
			expect(result).not.toContain('onclick');
			expect(result).not.toContain('alert');
		});

		it('should remove dangerous attributes', () => {
			const input = '<a href="javascript:void(0)">Link</a>';
			const result = sanitizeHtml(input);
			
			expect(result).not.toContain('javascript:');
		});

		it('should handle empty input', () => {
			const result = sanitizeHtml('');
			expect(result).toBe('');
		});

		it('should handle plain text', () => {
			const input = 'Just plain text, no HTML';
			const result = sanitizeHtml(input);
			expect(result).toBe(input);
		});
	});

	describe('sanitizeInput', () => {
		it('should trim whitespace', () => {
			const input = '  text with spaces  ';
			const result = sanitizeInput(input);
			expect(result).toBe('text with spaces');
		});

		it('should limit length', () => {
			const input = 'a'.repeat(1000);
			const result = sanitizeInput(input, 100);
			expect(result.length).toBeLessThanOrEqual(100);
		});

		it('should remove SQL injection patterns', () => {
			const input = "'; DROP TABLE users; --";
			const result = sanitizeInput(input);
			expect(result).not.toContain('DROP TABLE');
			expect(result).not.toContain('--');
		});

		it('should allow normal text', () => {
			const input = 'This is a normal character name';
			const result = sanitizeInput(input);
			expect(result).toBe(input);
		});

		it('should allow alphanumeric and common punctuation', () => {
			const input = "Hero's Name - Level 5!";
			const result = sanitizeInput(input);
			expect(result.length).toBeGreaterThan(0);
		});

		it('should handle unicode characters', () => {
			const input = 'Hérøe ñame 日本';
			const result = sanitizeInput(input);
			expect(result.length).toBeGreaterThan(0);
		});

		it('should use default max length if not specified', () => {
			const input = 'a'.repeat(300);
			const result = sanitizeInput(input);
			expect(result.length).toBeLessThanOrEqual(255); // Assuming default is 255
		});
	});
});
