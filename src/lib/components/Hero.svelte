<script lang="ts">
	import { page } from '$app/state';
</script>

<section
	class="hero bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100 py-20 text-center transition-all"
>
	<div class="container mx-auto px-4">
		<h1 class="font-heading text-primary-600 dark:text-primary-400 text-4xl font-bold md:text-5xl">
			The Corelight Fall
		</h1>
		<p class="text-surface-700 dark:text-surface-300 mt-2 text-lg font-medium">
			Explore the ruins of a shattered world and uncover its secrets.
		</p>
		<div class="mt-8 flex justify-center gap-4">
			{#if !page.data?.player}
				<a href="/auth/login" class="btn btn-primary">Login</a>
				<a href="/auth/register" class="btn btn-secondary">Register</a>
			{:else}
				<a href="/game" class="btn btn-primary">Play Now</a>
			{/if}
			<a href="/about" class="btn btn-outline">Learn More</a>
		</div>
	</div>
</section>
