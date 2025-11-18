<script lang="ts">
	import Map from '@lucide/svelte/icons/map';
	import Swords from '@lucide/svelte/icons/swords';
	import Settings from '@lucide/svelte/icons/settings';
	import Users from '@lucide/svelte/icons/users';
</script>

<section
	class="features bg-surface-200 dark:bg-surface-800 text-surface-900 dark:text-surface-100 px-8 py-16"
>
	<div class="mx-auto max-w-4xl space-y-8">
		<!-- Title -->
		<h2 class="text-center text-4xl font-bold">Features</h2>

		<!-- Core Gameplay -->
		<div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
			<div class="flex items-center gap-4">
				<Map class="text-primary-500 dark:text-primary-400 h-10 w-10" />
				<p>
					<strong>Story-Driven Exploration:</strong> Uncover secrets in a multi-layered vertical world.
				</p>
			</div>
			<div class="flex items-center gap-4">
				<Swords class="text-primary-500 dark:text-primary-400 h-10 w-10" />
				<p>
					<strong>Dynamic Combat:</strong> Engage corrupted enemies using a mix of tech and magic.
				</p>
			</div>
			<div class="flex items-center gap-4">
				<Settings class="text-primary-500 dark:text-primary-400 h-10 w-10" />
				<p><strong>Resource Management:</strong> Scavenge and craft to sustain your journey.</p>
			</div>
			<div class="flex items-center gap-4">
				<Users class="text-primary-500 dark:text-primary-400 h-10 w-10" />
				<p>
					<strong>Faction Alignment:</strong> Influence the world through your chosen allegiance.
				</p>
			</div>
		</div>
	</div>
</section>






