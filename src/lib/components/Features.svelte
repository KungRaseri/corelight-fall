<script lang="ts">
	import Map from '@lucide/svelte/icons/map';
	import Swords from '@lucide/svelte/icons/swords';
	import Settings from '@lucide/svelte/icons/settings';
	import Users from '@lucide/svelte/icons/users';
</script>

<!-- Features Section -->
<section
	class="features bg-surface-200 dark:bg-surface-800 text-surface-900 dark:text-surface-100 px-8 py-16"
>
	<div class="mx-auto max-w-5xl space-y-8">
		<!-- Title -->
		<h2 class="text-center text-4xl font-bold">Game Features</h2>

		<!-- Feature List -->
		<div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
			<div class="flex flex-col items-center space-y-2">
				<Map class="text-primary-500 dark:text-primary-400 h-12 w-12" />
				<h3 class="text-center text-xl font-semibold">Story-Driven Exploration</h3>
				<p class="text-center text-lg">
					Traverse a vertical, layered world, uncover ancient secrets, and piece together the fall
					of the Corelight.
				</p>
			</div>
			<div class="flex flex-col items-center space-y-2">
				<Swords class="text-primary-500 dark:text-primary-400 h-12 w-12" />
				<h3 class="text-center text-xl font-semibold">Dynamic Combat</h3>
				<p class="text-center text-lg">
					Battle corrupted entities using a blend of arcane and technological abilities.
				</p>
			</div>
			<div class="flex flex-col items-center space-y-2">
				<Settings class="text-primary-500 dark:text-primary-400 h-12 w-12" />
				<h3 class="text-center text-xl font-semibold">Resource Management</h3>
				<p class="text-center text-lg">
					Gather relics, craft items, and manage resources to survive.
				</p>
			</div>
			<div class="flex flex-col items-center space-y-2">
				<Users class="text-primary-500 dark:text-primary-400 h-12 w-12" />
				<h3 class="text-center text-xl font-semibold">Faction Alignment</h3>
				<p class="text-center text-lg">
					Choose a path with one of four factions or shape your own destiny.
				</p>
			</div>
		</div>

		<!-- Learn More Button -->
		<div class="mt-8 text-center">
			<a href="/features" class="btn preset-filled-primary-500">Learn More</a>
		</div>
	</div>
</section>






