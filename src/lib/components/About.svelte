<script lang="ts">
	import { BookOpen } from 'lucide-svelte';
</script>

<!-- About Section -->
<section
	class="about bg-surface-100 dark:bg-surface-900 text-surface-900 dark:text-surface-100 px-8 py-20"
>
	<div class="mx-auto max-w-4xl space-y-8">
		<!-- Title -->
		<h2 class="text-center text-4xl md:text-5xl font-bold font-heading text-primary-500 dark:text-primary-400">
			About The Corelight Fall
		</h2>

		<!-- Summary -->
		<p class="text-center text-lg md:text-xl text-surface-700 dark:text-surface-300 leading-relaxed">
			In a world where divine technology and arcane power have collided, survivors known as Drifters
			navigate the ruins of a shattered world. Discover ancient relics, battle corrupted entities,
			and shape the future of this fallen realm.
		</p>

		<!-- Learn More Button -->
		<div class="mt-8 text-center">
			<a href="/about" class="btn preset-filled-primary flex items-center gap-2 mx-auto w-fit">
				<BookOpen class="size-5" />
				<span>Learn More</span>
			</a>
		</div>
	</div>
</section>






