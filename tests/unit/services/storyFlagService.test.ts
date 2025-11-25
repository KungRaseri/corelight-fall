import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storyFlagService } from '$lib/server/services/storyFlagService';
import { db } from '$lib/server/db';

// Mock the database
vi.mock('$lib/server/db', () => ({
	db: {
		select: vi.fn(),
		insert: vi.fn(),
		update: vi.fn(),
		delete: vi.fn()
	}
}));

describe('StoryFlagService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('setFlag', () => {
		it('should create a new boolean flag', async () => {
			const mockSelect = vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([])
				})
			});

			const mockInsert = vi.fn().mockReturnValue({
				values: vi.fn().mockResolvedValue(undefined)
			});

			(db.select as any) = mockSelect;
			(db.insert as any) = mockInsert;

			const result = await storyFlagService.setFlag(1, 'test_flag', true);

			expect(result).toEqual({ flagName: 'test_flag', value: true });
			expect(mockInsert).toHaveBeenCalled();
		});

		it('should update an existing flag', async () => {
			const existingFlag = {
				id: 1,
				flagName: 'test_flag',
				isPermanent: false,
				flagType: 'boolean' as const,
				booleanValue: false
			};

			const mockSelect = vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([existingFlag])
				})
			});

			const mockUpdate = vi.fn().mockReturnValue({
				set: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue(undefined)
				})
			});

			(db.select as any) = mockSelect;
			(db.update as any) = mockUpdate;

			const result = await storyFlagService.setFlag(1, 'test_flag', true);

			expect(result).toEqual({ flagName: 'test_flag', value: true });
			expect(mockUpdate).toHaveBeenCalled();
		});

		it('should throw error when updating permanent flag', async () => {
			const existingFlag = {
				id: 1,
				flagName: 'permanent_flag',
				isPermanent: true,
				flagType: 'boolean' as const
			};

			const mockSelect = vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([existingFlag])
				})
			});

			(db.select as any) = mockSelect;

			await expect(
				storyFlagService.setFlag(1, 'permanent_flag', false)
			).rejects.toThrow('permanent and cannot be changed');
		});
	});

	describe('getFlag', () => {
		it('should return null for non-existent flag', async () => {
			const mockSelect = vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([])
				})
			});

			(db.select as any) = mockSelect;

			const result = await storyFlagService.getFlag(1, 'nonexistent');

			expect(result).toBeNull();
		});

		it('should return boolean value', async () => {
			const flag = {
				flagType: 'boolean' as const,
				booleanValue: true,
				integerValue: null,
				textValue: null
			};

			const mockSelect = vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([flag])
				})
			});

			(db.select as any) = mockSelect;

			const result = await storyFlagService.getFlag(1, 'test_flag');

			expect(result).toBe(true);
		});

		it('should return integer value', async () => {
			const flag = {
				flagType: 'integer' as const,
				booleanValue: null,
				integerValue: 42,
				textValue: null
			};

			const mockSelect = vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([flag])
				})
			});

			(db.select as any) = mockSelect;

			const result = await storyFlagService.getFlag(1, 'test_counter');

			expect(result).toBe(42);
		});

		it('should return text value', async () => {
			const flag = {
				flagType: 'text' as const,
				booleanValue: null,
				integerValue: null,
				textValue: 'test value'
			};

			const mockSelect = vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([flag])
				})
			});

			(db.select as any) = mockSelect;

			const result = await storyFlagService.getFlag(1, 'test_text');

			expect(result).toBe('test value');
		});
	});

	describe('checkFlag', () => {
		it('should return true when flag matches expected value', async () => {
			const flag = {
				flagType: 'boolean' as const,
				booleanValue: true
			};

			const mockSelect = vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([flag])
				})
			});

			(db.select as any) = mockSelect;

			const result = await storyFlagService.checkFlag(1, 'test_flag', true);

			expect(result).toBe(true);
		});

		it('should return false when flag does not match expected value', async () => {
			const flag = {
				flagType: 'boolean' as const,
				booleanValue: false
			};

			const mockSelect = vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([flag])
				})
			});

			(db.select as any) = mockSelect;

			const result = await storyFlagService.checkFlag(1, 'test_flag', true);

			expect(result).toBe(false);
		});
	});

	describe('deleteFlag', () => {
		it('should delete non-permanent flag', async () => {
			const flag = {
				id: 1,
				flagName: 'test_flag',
				isPermanent: false
			};

			const mockSelect = vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([flag])
				})
			});

			const mockDelete = vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue(undefined)
			});

			(db.select as any) = mockSelect;
			(db.delete as any) = mockDelete;

			const result = await storyFlagService.deleteFlag(1, 'test_flag');

			expect(result).toEqual({ success: true });
			expect(mockDelete).toHaveBeenCalled();
		});

		it('should throw error when deleting permanent flag', async () => {
			const flag = {
				id: 1,
				flagName: 'permanent_flag',
				isPermanent: true
			};

			const mockSelect = vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([flag])
				})
			});

			(db.select as any) = mockSelect;

			await expect(
				storyFlagService.deleteFlag(1, 'permanent_flag')
			).rejects.toThrow('Cannot delete permanent flag');
		});

		it('should throw error when flag not found', async () => {
			const mockSelect = vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([])
				})
			});

			(db.select as any) = mockSelect;

			await expect(
				storyFlagService.deleteFlag(1, 'nonexistent')
			).rejects.toThrow('Flag not found');
		});
	});
});
