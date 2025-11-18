<script lang="ts">
	import { BookOpen } from 'lucide-svelte';
</script>

<!-- About Section -->
<section
	class="about bg-gradient-to-b from-surface-100 to-surface-200 dark:from-surface-900 dark:to-surface-800 text-surface-900 dark:text-surface-100 px-8 py-24"
>
	<div class="mx-auto max-w-4xl space-y-12">
		<!-- Title -->
		<h2 class="text-center text-4xl md:text-5xl font-bold font-heading text-primary-500 dark:text-primary-400">
			About The Corelight Fall
		</h2>

		<!-- Summary Card -->
		<div class="card preset-glass-surface p-8 md:p-10 rounded-2xl shadow-xl">
			<p class="text-center text-lg md:text-xl text-surface-700 dark:text-surface-300 leading-relaxed">
				In a world where divine technology and arcane power have collided, survivors known as <span class="text-primary-500 dark:text-primary-400 font-semibold">Drifters</span>
				navigate the ruins of a shattered world. Discover ancient relics, battle corrupted entities,
				and shape the future of this fallen realm.
			</p>

			<!-- Stats Grid -->
			<div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
				<div class="text-center p-4 rounded-lg bg-surface-50/50 dark:bg-surface-950/50">
					<div class="text-3xl font-bold text-primary-500 dark:text-primary-400">4</div>
					<div class="text-sm text-surface-600 dark:text-surface-400 mt-1">Unique Factions</div>
				</div>
				<div class="text-center p-4 rounded-lg bg-surface-50/50 dark:bg-surface-950/50">
					<div class="text-3xl font-bold text-primary-500 dark:text-primary-400">∞</div>
					<div class="text-sm text-surface-600 dark:text-surface-400 mt-1">Stories to Uncover</div>
				</div>
				<div class="text-center p-4 rounded-lg bg-surface-50/50 dark:bg-surface-950/50">
					<div class="text-3xl font-bold text-primary-500 dark:text-primary-400">1</div>
					<div class="text-sm text-surface-600 dark:text-surface-400 mt-1">Shattered World</div>
				</div>
			</div>
		</div>

		<!-- Learn More Button -->
		<div class="mt-8 text-center">
			<a href="/about" class="btn preset-glass-surface-primary flex items-center gap-2 mx-auto w-fit px-6 py-3 text-lg rounded-xl shadow-lg">
				<BookOpen class="size-5" />
				<span>Learn More</span>
			</a>
		</div>
	</div>
</section>






