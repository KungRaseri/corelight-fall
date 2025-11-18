<script lang="ts">
	import Map from 'lucide-svelte/icons/map';
	import Swords from 'lucide-svelte/icons/swords';
	import Settings from 'lucide-svelte/icons/settings';
	import Users from 'lucide-svelte/icons/users';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
</script>

<!-- Features Section -->
<section
	class="features bg-surface-200 dark:bg-surface-800 text-surface-900 dark:text-surface-100 px-8 py-20"
>
	<div class="mx-auto max-w-6xl space-y-12">
		<!-- Title -->
		<h2 class="text-center text-4xl md:text-5xl font-bold font-heading text-primary-500 dark:text-primary-400">
			Game Features
		</h2>

		<!-- Feature List -->
		<div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
			<div class="card preset-glass-surface p-6 flex flex-col items-center space-y-4 text-center hover:preset-glass-primary transition-all duration-300">
				<div class="preset-glass-primary p-4 rounded-full">
					<Map class="size-8" />
				</div>
				<h3 class="text-xl font-semibold font-heading">Story-Driven Exploration</h3>
				<p class="text-surface-700 dark:text-surface-300">
					Traverse a vertical, layered world, uncover ancient secrets, and piece together the fall
					of the Corelight.
				</p>
			</div>
			<div class="card preset-glass-surface p-6 flex flex-col items-center space-y-4 text-center hover:preset-glass-primary transition-all duration-300">
				<div class="preset-glass-primary p-4 rounded-full">
					<Swords class="size-8" />
				</div>
				<h3 class="text-xl font-semibold font-heading">Dynamic Combat</h3>
				<p class="text-surface-700 dark:text-surface-300">
					Battle corrupted entities using a blend of arcane and technological abilities.
				</p>
			</div>
			<div class="card preset-glass-surface p-6 flex flex-col items-center space-y-4 text-center hover:preset-glass-primary transition-all duration-300">
				<div class="preset-glass-primary p-4 rounded-full">
					<Settings class="size-8" />
				</div>
				<h3 class="text-xl font-semibold font-heading">Resource Management</h3>
				<p class="text-surface-700 dark:text-surface-300">
					Gather relics, craft items, and manage resources to survive.
				</p>
			</div>
			<div class="card preset-glass-surface p-6 flex flex-col items-center space-y-4 text-center hover:preset-glass-primary transition-all duration-300">
				<div class="preset-glass-primary p-4 rounded-full">
					<Users class="size-8" />
				</div>
				<h3 class="text-xl font-semibold font-heading">Faction Alignment</h3>
				<p class="text-surface-700 dark:text-surface-300">
					Choose a path with one of four factions or shape your own destiny.
				</p>
			</div>
		</div>

		<!-- Learn More Button -->
		<div class="mt-12 text-center">
			<a href="/features" class="btn preset-glass-primary flex items-center gap-2 mx-auto w-fit">
				<span>Explore All Features</span>
				<ArrowRight class="size-5" />
			</a>
		</div>
	</div>
</section>






