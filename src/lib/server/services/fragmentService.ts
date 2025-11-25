import { db } from '../db';
import { 
	fragment, 
	characterFragment, 
	fragmentVision 
} from '../db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Fragment Service - Manages fragment collection, attunement, and visions
 */

export class FragmentService {
	/**
	 * Get all fragments discovered by a character
	 */
	async getCharacterFragments(characterId: number) {
		return await db
			.select({
				characterFragment: characterFragment,
				fragment: fragment
			})
			.from(characterFragment)
			.innerJoin(fragment, eq(characterFragment.fragmentId, fragment.id))
			.where(eq(characterFragment.characterId, characterId));
	}

	/**
	 * Get a specific character fragment
	 */
	async getCharacterFragment(characterId: number, fragmentId: number) {
		const [result] = await db
			.select({
				characterFragment: characterFragment,
				fragment: fragment
			})
			.from(characterFragment)
			.innerJoin(fragment, eq(characterFragment.fragmentId, fragment.id))
			.where(
				and(
					eq(characterFragment.characterId, characterId),
					eq(characterFragment.fragmentId, fragmentId)
				)
			);

		return result || null;
	}

	/**
	 * Discover a new fragment
	 */
	async discoverFragment(characterId: number, fragmentId: number, acquiredHow: string = 'found') {
		// Check if fragment exists
		const [fragmentData] = await db
			.select()
			.from(fragment)
			.where(eq(fragment.id, fragmentId));

		if (!fragmentData) {
			throw new Error('Fragment not found');
		}

		// Check if already discovered
		const existing = await this.getCharacterFragment(characterId, fragmentId);
		if (existing) {
			throw new Error('Fragment already discovered');
		}

		// Create character fragment
		await db
			.insert(characterFragment)
			.values({
				characterId,
				fragmentId,
				acquiredAt: new Date(),
				acquiredHow,
				attunementProgress: 0,
				isAttuned: false,
				totalUseCount: 0
			});

		return { success: true, fragmentId };
	}

	/**
	 * Increase attunement progress
	 */
	async increaseAttunement(
		characterId: number,
		fragmentId: number,
		amount: number
	) {
		const existing = await this.getCharacterFragment(characterId, fragmentId);

		if (!existing) {
			throw new Error('Fragment not discovered');
		}

		const currentProgress = existing.characterFragment.attunementProgress ?? 0;
		const newProgress = Math.min(100, currentProgress + amount);
		const wasAttuned = existing.characterFragment.isAttuned ?? false;
		const isNowAttuned = newProgress >= 100;

		await db
			.update(characterFragment)
			.set({
				attunementProgress: newProgress,
				isAttuned: isNowAttuned,
				lastAttunementGain: new Date()
			})
			.where(eq(characterFragment.id, existing.characterFragment.id));

		return {
			fragmentId,
			previousProgress: currentProgress,
			newProgress,
			becameAttuned: !wasAttuned && isNowAttuned
		};
	}

	/**
	 * Use a fragment ability
	 */
	async useFragment(characterId: number, fragmentId: number) {
		const existing = await this.getCharacterFragment(characterId, fragmentId);

		if (!existing) {
			throw new Error('Fragment not discovered');
		}

		const isAttuned = existing.characterFragment.isAttuned ?? false;
		if (!isAttuned) {
			throw new Error('Fragment not attuned');
		}

		const currentUseCount = existing.characterFragment.totalUseCount ?? 0;

		await db
			.update(characterFragment)
			.set({
				totalUseCount: currentUseCount + 1,
				lastVisionAt: new Date()
			})
			.where(eq(characterFragment.id, existing.characterFragment.id));

		return { success: true, totalUseCount: currentUseCount + 1 };
	}

	/**
	 * Get visions for a fragment
	 */
	async getFragmentVisions(fragmentId: number) {
		return await db
			.select()
			.from(fragmentVision)
			.where(eq(fragmentVision.fragmentId, fragmentId));
	}

	/**
	 * Trigger a vision (check if character meets requirements)
	 */
	async checkVisionAvailability(
		characterId: number,
		visionId: number
	): Promise<boolean> {
		const [vision] = await db
			.select()
			.from(fragmentVision)
			.where(eq(fragmentVision.id, visionId));

		if (!vision) {
			return false;
		}

		// Check if fragment is discovered
		const charFragment = await this.getCharacterFragment(characterId, vision.fragmentId);
		
		if (!charFragment) {
			return false;
		}

		// Check attunement requirement from triggeredWhen conditions
		const attunementProgress = charFragment.characterFragment.attunementProgress ?? 0;
		const requiredAttunement = vision.triggeredWhen?.attunementLevel ?? 0;
		
		if (attunementProgress < requiredAttunement) {
			return false;
		}

		return true;
	}

	/**
	 * Get fragment statistics for a character
	 */
	async getFragmentStats(characterId: number) {
		const fragments = await this.getCharacterFragments(characterId);

		const total = fragments.length;
		const attuned = fragments.filter(f => f.characterFragment.isAttuned).length;
		const totalAttunement = fragments.reduce(
			(sum, f) => sum + (f.characterFragment.attunementProgress ?? 0),
			0
		);
		const averageAttunement = total > 0 ? totalAttunement / total : 0;

		return {
			totalFragments: total,
			attunedFragments: attuned,
			averageAttunement: Math.round(averageAttunement),
			fragmentsInProgress: total - attuned
		};
	}
}

export const fragmentService = new FragmentService();
