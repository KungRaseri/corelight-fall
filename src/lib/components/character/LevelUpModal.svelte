<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { TrendingUp, Award, Heart, Coins } from 'lucide-svelte';

	interface Props {
		open: boolean;
		onClose: () => void;
		levelUpData: {
			newLevel: number;
			levelsGained: number;
			attributePoints: number;
			maxHpIncrease: number;
			goldBonus: number;
		} | null;
	}

	let { open, onClose, levelUpData }: Props = $props();
</script>

{#if levelUpData && open}
	<Dialog open={true}>
		<Portal>
			<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-950/80 backdrop-blur-sm" />
			<Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center p-4">
				<Dialog.Content
					class="card bg-surface-50 dark:bg-surface-900 w-full max-w-md p-6 space-y-4 shadow-xl border-2 border-primary-500"
				>
					<!-- Header -->
					<div class="text-center space-y-2">
						<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/20 mb-2">
							<TrendingUp class="size-8 text-primary-500" />
						</div>
						<Dialog.Title class="text-3xl font-bold text-primary-500">
							Level Up!
						</Dialog.Title>
						<Dialog.Description class="text-lg">
							You reached <span class="font-bold text-primary-500">Level {levelUpData.newLevel}</span>!
						</Dialog.Description>
					</div>

					<!-- Rewards -->
					<div class="space-y-3 py-4">
						<h3 class="text-sm font-semibold uppercase tracking-wide text-surface-600 dark:text-surface-400">
							Rewards
						</h3>

						<!-- Attribute Points -->
						<div class="flex items-center gap-3 p-3 rounded-lg bg-surface-100 dark:bg-surface-800">
							<div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500/20">
								<Award class="size-5 text-primary-500" />
							</div>
							<div class="flex-1">
								<p class="font-medium">Attribute Points</p>
								<p class="text-sm text-surface-600 dark:text-surface-400">
									Improve your character's abilities
								</p>
							</div>
							<span class="text-2xl font-bold text-primary-500">
								+{levelUpData.attributePoints}
							</span>
						</div>

						<!-- Max HP Increase -->
						<div class="flex items-center gap-3 p-3 rounded-lg bg-surface-100 dark:bg-surface-800">
							<div class="flex items-center justify-center w-10 h-10 rounded-full bg-error-500/20">
								<Heart class="size-5 text-error-500" />
							</div>
							<div class="flex-1">
								<p class="font-medium">Maximum Health</p>
								<p class="text-sm text-surface-600 dark:text-surface-400">
									Fully healed!
								</p>
							</div>
							<span class="text-2xl font-bold text-error-500">
								+{levelUpData.maxHpIncrease}
							</span>
						</div>

						<!-- Gold Bonus -->
						<div class="flex items-center gap-3 p-3 rounded-lg bg-surface-100 dark:bg-surface-800">
							<div class="flex items-center justify-center w-10 h-10 rounded-full bg-warning-500/20">
								<Coins class="size-5 text-warning-500" />
							</div>
							<div class="flex-1">
								<p class="font-medium">Gold</p>
								<p class="text-sm text-surface-600 dark:text-surface-400">
									Bonus reward
								</p>
							</div>
							<span class="text-2xl font-bold text-warning-500">
								+{levelUpData.goldBonus}
							</span>
						</div>
					</div>

					<!-- Close Button -->
					<button
						onclick={onClose}
						class="btn preset-filled-primary w-full flex items-center justify-center gap-2"
					>
						Continue
					</button>
				</Dialog.Content>
			</Dialog.Positioner>
		</Portal>
	</Dialog>
{/if}
