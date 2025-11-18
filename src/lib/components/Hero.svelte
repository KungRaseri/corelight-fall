<script lang="ts">
	import { page } from '$app/state';
	import { LogIn, UserPlus, PlayCircle, Info } from 'lucide-svelte';
</script>

<section
	class="hero bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100 py-20 text-center transition-colors"
>
	<div class="container mx-auto px-4">
		<h1 class="font-heading text-primary-500 dark:text-primary-400 text-5xl font-bold md:text-6xl mb-4">
			The Corelight Fall
		</h1>
		<p class="text-surface-700 dark:text-surface-300 mt-2 text-xl font-medium max-w-2xl mx-auto">
			Explore the ruins of a shattered world and uncover its secrets.
		</p>
		<div class="mt-8 flex justify-center gap-4 flex-wrap">
			{#if !page.data?.user}
				<a href="/auth/login" class="btn preset-glass-primary flex items-center gap-2">
					<LogIn class="size-5" />
					<span>Login</span>
				</a>
				<a href="/auth/register" class="btn preset-glass-secondary flex items-center gap-2">
					<UserPlus class="size-5" />
					<span>Register</span>
				</a>
			{:else}
				<a href="/game" class="btn preset-glass-primary flex items-center gap-2">
					<PlayCircle class="size-5" />
					<span>Play Now</span>
				</a>
			{/if}
			<a href="/about" class="btn preset-glass-primary flex items-center gap-2">
				<Info class="size-5" />
				<span>Learn More</span>
			</a>
		</div>
	</div>
</section>






