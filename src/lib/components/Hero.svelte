<script lang="ts">
	import { page } from '$app/state';
	import { LogIn, UserPlus, PlayCircle, Info } from 'lucide-svelte';
</script>

<section
	class="hero relative bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-950 dark:to-surface-900 text-surface-900 dark:text-surface-100 py-32 text-center transition-colors overflow-hidden"
>
	<!-- Decorative background elements -->
	<div class="absolute inset-0 opacity-30 dark:opacity-20">
		<div class="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl"></div>
		<div class="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500 rounded-full blur-3xl"></div>
	</div>

	<div class="container mx-auto px-4 relative z-10">
		<div class="max-w-4xl mx-auto space-y-8">
			<!-- Hero Title -->
			<div class="space-y-4">
				<h1 class="font-heading text-primary-500 dark:text-primary-400 text-5xl font-bold md:text-7xl mb-4 tracking-tight">
					The Corelight Fall
				</h1>
				<p class="text-surface-700 dark:text-surface-300 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
					Explore the ruins of a shattered world and uncover its secrets.
				</p>
			</div>

			<!-- Call to Action Buttons -->
			<div class="mt-12 flex justify-center gap-4 flex-wrap">
				{#if !page.data?.user}
					<a href="/auth/login" class="btn preset-glass-surface-primary flex items-center gap-2 px-6 py-3 text-lg rounded-xl shadow-lg">
						<LogIn class="size-5" />
						<span>Login</span>
					</a>
					<a href="/auth/register" class="btn preset-glass-surface-secondary flex items-center gap-2 px-6 py-3 text-lg rounded-xl shadow-lg">
						<UserPlus class="size-5" />
						<span>Register</span>
					</a>
				{:else}
					<a href="/game" class="btn preset-glass-surface-primary flex items-center gap-2 px-6 py-3 text-lg rounded-xl shadow-lg">
						<PlayCircle class="size-5" />
						<span>Play Now</span>
					</a>
				{/if}
				<a href="/about" class="btn preset-glass-surface flex items-center gap-2 px-6 py-3 text-lg rounded-xl">
					<Info class="size-5" />
					<span>Learn More</span>
				</a>
			</div>

			<!-- Feature Highlights -->
			<div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
				<div class="card preset-glass-surface p-6 rounded-xl">
					<h3 class="text-lg font-semibold text-primary-500 dark:text-primary-400 mb-2">Story-Driven</h3>
					<p class="text-surface-700 dark:text-surface-300 text-sm">Uncover the mysteries of a fallen civilization</p>
				</div>
				<div class="card preset-glass-surface p-6 rounded-xl">
					<h3 class="text-lg font-semibold text-primary-500 dark:text-primary-400 mb-2">Dynamic Combat</h3>
					<p class="text-surface-700 dark:text-surface-300 text-sm">Master arcane and technological abilities</p>
				</div>
				<div class="card preset-glass-surface p-6 rounded-xl">
					<h3 class="text-lg font-semibold text-primary-500 dark:text-primary-400 mb-2">Faction Choice</h3>
					<p class="text-surface-700 dark:text-surface-300 text-sm">Align with factions or forge your own path</p>
				</div>
			</div>
		</div>
	</div>
</section>






