import { describe, it, expect } from 'vitest';
import { relationshipService } from '$lib/server/services/relationshipService';

describe('RelationshipService', () => {
	describe('getRelationshipStatus', () => {
		it('should return correct status for high positive relationship', () => {
			expect(relationshipService.getRelationshipStatus(85)).toBe('Devoted');
			expect(relationshipService.getRelationshipStatus(65)).toBe('Trusted');
			expect(relationshipService.getRelationshipStatus(45)).toBe('Friendly');
		});

		it('should return correct status for neutral relationship', () => {
			expect(relationshipService.getRelationshipStatus(25)).toBe('Acquaintance');
			expect(relationshipService.getRelationshipStatus(5)).toBe('Neutral');
		});

		it('should return correct status for negative relationship', () => {
			expect(relationshipService.getRelationshipStatus(-10)).toBe('Wary');
			expect(relationshipService.getRelationshipStatus(-30)).toBe('Unfriendly');
			expect(relationshipService.getRelationshipStatus(-50)).toBe('Hostile');
			expect(relationshipService.getRelationshipStatus(-70)).toBe('Enemies');
		});

		it('should handle boundary values', () => {
			expect(relationshipService.getRelationshipStatus(80)).toBe('Devoted');
			expect(relationshipService.getRelationshipStatus(60)).toBe('Trusted');
			expect(relationshipService.getRelationshipStatus(40)).toBe('Friendly');
			expect(relationshipService.getRelationshipStatus(20)).toBe('Acquaintance');
			expect(relationshipService.getRelationshipStatus(0)).toBe('Neutral');
			expect(relationshipService.getRelationshipStatus(-20)).toBe('Wary');
			expect(relationshipService.getRelationshipStatus(-40)).toBe('Unfriendly');
			expect(relationshipService.getRelationshipStatus(-60)).toBe('Hostile');
		});
	});
});
