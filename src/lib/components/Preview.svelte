<script lang="ts">
	import { Sparkles } from 'lucide-svelte';
</script>

<section
	class="preview bg-surface-100 dark:bg-surface-900 text-surface-900 dark:text-surface-100 px-8 py-20"
>
	<div class="mx-auto max-w-6xl space-y-8">
		<!-- Title -->
		<h2 class="text-center text-4xl md:text-5xl font-bold font-heading text-primary-500 dark:text-primary-400">
			Game Preview
		</h2>

		<!-- Description -->
		<p class="text-center text-lg md:text-xl text-surface-700 dark:text-surface-300 max-w-3xl mx-auto leading-relaxed">
			Dive into the world of Corelight Fall. Explore fragmented landscapes, engage in dynamic
			combat, and uncover the mysteries left behind by a shattered civilization.
		</p>

		<!-- Preview Container -->
		<div class="card preset-glass-surface relative rounded-xl overflow-hidden shadow-2xl">
			<!-- Placeholder Image or Slideshow -->
			<div
				class="flex h-96 w-full items-center justify-center bg-gradient-to-br from-primary-500/20 to-secondary-500/20 dark:from-primary-500/10 dark:to-secondary-500/10"
			>
				<div class="text-center space-y-4">
					<Sparkles class="size-16 text-primary-500 dark:text-primary-400 mx-auto animate-pulse" />
					<span class="text-2xl font-semibold text-surface-700 dark:text-surface-300">Preview coming soon...</span>
				</div>
			</div>

			<!-- Call to Action -->
			<div class="absolute right-6 bottom-6">
				<a href="/game" class="btn preset-glass-primary flex items-center gap-2 shadow-lg">
					<Sparkles class="size-5" />
					<span>Start Your Journey</span>
				</a>
			</div>
		</div>
	</div>
</section>






