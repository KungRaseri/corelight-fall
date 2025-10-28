<script lang="ts">
	import Map from '@lucide/svelte/icons/map';
	import Flame from '@lucide/svelte/icons/flame';
	import Settings from '@lucide/svelte/icons/settings';
	import Brain from '@lucide/svelte/icons/brain';
</script>

<section
	class="about bg-surface-100 dark:bg-surface-900 text-surface-900 dark:text-surface-100 px-8 py-16"
>
	<div class="mx-auto max-w-4xl space-y-8">
		<!-- Title -->
		<h2 class="text-center text-4xl font-bold">About The Corelight Fall</h2>

		<!-- Introduction -->
		<p class="text-center text-lg">
			The Corelight Fall marks the catastrophic event where divine technology and arcane power
			collided, shattering civilization. Survivors known as Drifters navigate the fractured world,
			salvaging relics and battling corrupted entities.
		</p>

		<!-- The World -->
		<h3 class="text-2xl font-semibold">The World of Corelight</h3>
		<p>
			Once a thriving civilization powered by divine fusion technology, the world now lies in ruins.
			Towering vertical layers of decaying machinery and forgotten temples stretch skyward. As a
			Drifter, you navigate the remnants, using your divine-tech enhancements to survive the
			Corelight's corrupted influence.
		</p>

		<!-- Factions -->
		<h3 class="text-2xl font-semibold">Factions of Corelight</h3>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="flex items-center gap-4">
				<Flame class="text-primary-500 dark:text-primary-400 h-8 w-8" />
				<p>
					<strong>Cinderlight Conclave:</strong> Seek to reignite the Corelight through ritual and sacrifice.
				</p>
			</div>
			<div class="flex items-center gap-4">
				<Settings class="text-primary-500 dark:text-primary-400 h-8 w-8" />
				<p>
					<strong>Forgewalkers Union:</strong> Scavengers and engineers aiming to restore lost technology.
				</p>
			</div>
			<div class="flex items-center gap-4">
				<Map class="text-primary-500 dark:text-primary-400 h-8 w-8" />
				<p><strong>Hollow Creed:</strong> Embrace decay, seeking to accelerate the world’s end.</p>
			</div>
			<div class="flex items-center gap-4">
				<Brain class="text-primary-500 dark:text-primary-400 h-8 w-8" />
				<p>
					<strong>Eidol Archive:</strong> AI-driven collective reconstructing divine blueprints.
				</p>
			</div>
		</div>
	</div>
</section>
