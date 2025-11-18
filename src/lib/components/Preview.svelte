<script lang="ts">
	import { Sparkles } from 'lucide-svelte';
</script>

<section
	class="preview bg-gradient-to-b from-surface-100 to-surface-50 dark:from-surface-900 dark:to-surface-950 text-surface-900 dark:text-surface-100 px-8 py-24"
>
	<div class="mx-auto max-w-6xl space-y-12">
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
		<div class="card preset-glass-surface relative rounded-2xl overflow-hidden shadow-2xl border border-surface-300/50 dark:border-surface-700/50">
			<!-- Placeholder Image or Slideshow -->
			<div
				class="flex h-[32rem] w-full items-center justify-center bg-gradient-to-br from-primary-500/20 to-secondary-500/20 dark:from-primary-500/10 dark:to-secondary-500/10 relative"
			>
				<!-- Decorative elements -->
				<div class="absolute inset-0 opacity-20">
					<div class="absolute top-10 left-20 w-40 h-40 bg-primary-500 rounded-full blur-2xl animate-pulse"></div>
					<div class="absolute bottom-10 right-20 w-60 h-60 bg-secondary-500 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
				</div>

				<div class="text-center space-y-6 relative z-10">
					<Sparkles class="size-20 text-primary-500 dark:text-primary-400 mx-auto animate-pulse" />
					<div class="space-y-2">
						<span class="text-3xl font-bold text-surface-800 dark:text-surface-200 block">Preview coming soon...</span>
						<span class="text-lg text-surface-600 dark:text-surface-400 block">Experience the world of Corelight Fall</span>
					</div>
				</div>
			</div>

			<!-- Call to Action -->
			<div class="absolute right-6 bottom-6">
				<a href="/game" class="btn preset-glass-surface-primary flex items-center gap-2 px-6 py-3 text-lg rounded-xl shadow-xl">
					<Sparkles class="size-5" />
					<span>Start Your Journey</span>
				</a>
			</div>
		</div>
	</div>
</section>






