<script lang="ts">
	import Map from 'lucide-svelte/icons/map';
	import Swords from 'lucide-svelte/icons/swords';
	import Settings from 'lucide-svelte/icons/settings';
	import Users from 'lucide-svelte/icons/users';
	import BookOpen from 'lucide-svelte/icons/book-open';
	import Zap from 'lucide-svelte/icons/zap';
	import Heart from 'lucide-svelte/icons/heart';
	import Target from 'lucide-svelte/icons/target';
</script>

<svelte:head>
	<title>Features | The Corelight Fall</title>
</svelte:head>

<div class="features-page bg-gradient-to-b from-surface-50 to-surface-100 dark:from-surface-950 dark:to-surface-900 min-h-screen">
	<!-- Header Section -->
	<section class="px-8 py-24">
		<div class="mx-auto max-w-6xl space-y-12">
			<div class="text-center space-y-6">
				<h1 class="text-5xl md:text-6xl font-bold font-heading text-primary-500 dark:text-primary-400">
					Game Features
				</h1>
				<p class="text-xl md:text-2xl text-surface-700 dark:text-surface-300 leading-relaxed max-w-3xl mx-auto">
					Immerse yourself in a rich, story-driven RPG experience
				</p>
			</div>
		</div>
	</section>

	<!-- Core Features Grid -->
	<section class="px-8 py-16">
		<div class="mx-auto max-w-6xl space-y-12">
			<h2 class="text-3xl md:text-4xl font-bold text-center text-primary-500 dark:text-primary-400 mb-12">
				Core Gameplay
			</h2>

			<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
				<div class="card preset-glass-surface-primary p-6 flex flex-col items-center space-y-4 text-center transition-all duration-300 rounded-2xl shadow-lg">
					<div class="preset-glass-primary p-4 rounded-full shadow-md">
						<Map class="size-10" />
					</div>
					<h3 class="text-xl font-semibold font-heading text-primary-500 dark:text-primary-400">Story-Driven Exploration</h3>
					<p class="text-surface-700 dark:text-surface-300 text-sm leading-relaxed">
						Uncover secrets in a multi-layered vertical world. Traverse floating islands and corrupted ruins
						to piece together the fall of the Corelight.
					</p>
				</div>

				<div class="card preset-glass-surface-primary p-6 flex flex-col items-center space-y-4 text-center transition-all duration-300 rounded-2xl shadow-lg">
					<div class="preset-glass-primary p-4 rounded-full shadow-md">
						<Swords class="size-10" />
					</div>
					<h3 class="text-xl font-semibold font-heading text-primary-500 dark:text-primary-400">Dynamic Combat</h3>
					<p class="text-surface-700 dark:text-surface-300 text-sm leading-relaxed">
						Engage corrupted enemies using a mix of tech and magic. Master strategic combat that combines
						real-time action with tactical decision-making.
					</p>
				</div>

				<div class="card preset-glass-surface-primary p-6 flex flex-col items-center space-y-4 text-center transition-all duration-300 rounded-2xl shadow-lg">
					<div class="preset-glass-primary p-4 rounded-full shadow-md">
						<Settings class="size-10" />
					</div>
					<h3 class="text-xl font-semibold font-heading text-primary-500 dark:text-primary-400">Resource Management</h3>
					<p class="text-surface-700 dark:text-surface-300 text-sm leading-relaxed">
						Scavenge and craft to sustain your journey. Every resource matters in this harsh,
						unforgiving world.
					</p>
				</div>

				<div class="card preset-glass-surface-primary p-6 flex flex-col items-center space-y-4 text-center transition-all duration-300 rounded-2xl shadow-lg">
					<div class="preset-glass-primary p-4 rounded-full shadow-md">
						<Users class="size-10" />
					</div>
					<h3 class="text-xl font-semibold font-heading text-primary-500 dark:text-primary-400">Faction Alignment</h3>
					<p class="text-surface-700 dark:text-surface-300 text-sm leading-relaxed">
						Influence the world through your chosen allegiance. Shape the future of civilization
						through your faction choices.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Additional Features -->
	<section class="px-8 py-16 bg-gradient-to-b from-surface-100 to-surface-200 dark:from-surface-900 dark:to-surface-800">
		<div class="mx-auto max-w-6xl space-y-12">
			<h2 class="text-3xl md:text-4xl font-bold text-center text-primary-500 dark:text-primary-400 mb-12">
				Depth & Immersion
			</h2>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div class="card preset-glass-surface p-8 rounded-2xl shadow-lg flex items-start gap-6">
					<div class="preset-glass-primary p-4 rounded-full shadow-md flex-shrink-0">
						<BookOpen class="size-8" />
					</div>
					<div>
						<h3 class="text-xl font-bold font-heading text-primary-500 dark:text-primary-400 mb-3">Rich Lore</h3>
						<p class="text-surface-700 dark:text-surface-300 leading-relaxed">
							Discover the history of the Corelight through artifacts, ancient texts, and encounters with
							survivors. Every location tells a story of what was lost.
						</p>
					</div>
				</div>

				<div class="card preset-glass-surface p-8 rounded-2xl shadow-lg flex items-start gap-6">
					<div class="preset-glass-primary p-4 rounded-full shadow-md flex-shrink-0">
						<Zap class="size-8" />
					</div>
					<div>
						<h3 class="text-xl font-bold font-heading text-primary-500 dark:text-primary-400 mb-3">Hybrid Powers</h3>
						<p class="text-surface-700 dark:text-surface-300 leading-relaxed">
							Wield both arcane magic and Corelight technology. Customize your abilities and playstyle
							with a unique progression system that adapts to your choices.
						</p>
					</div>
				</div>

				<div class="card preset-glass-surface p-8 rounded-2xl shadow-lg flex items-start gap-6">
					<div class="preset-glass-primary p-4 rounded-full shadow-md flex-shrink-0">
						<Heart class="size-8" />
					</div>
					<div>
						<h3 class="text-xl font-bold font-heading text-primary-500 dark:text-primary-400 mb-3">Character Development</h3>
						<p class="text-surface-700 dark:text-surface-300 leading-relaxed">
							Shape your Drifter's personality, relationships, and reputation. Your interactions with NPCs
							and faction members create a unique narrative experience.
						</p>
					</div>
				</div>

				<div class="card preset-glass-surface p-8 rounded-2xl shadow-lg flex items-start gap-6">
					<div class="preset-glass-primary p-4 rounded-full shadow-md flex-shrink-0">
						<Target class="size-8" />
					</div>
					<div>
						<h3 class="text-xl font-bold font-heading text-primary-500 dark:text-primary-400 mb-3">Meaningful Choices</h3>
						<p class="text-surface-700 dark:text-surface-300 leading-relaxed">
							Every decision has consequences. Your actions influence faction relationships, story outcomes,
							and the fate of the shattered world itself.
						</p>
					</div>
				</div>
			</div>

			<!-- Call to Action -->
			<div class="text-center mt-12">
				<a href="/auth/register" class="btn preset-glass-surface-primary flex items-center gap-2 mx-auto w-fit px-6 py-3 text-lg rounded-xl shadow-lg">
					<span>Begin Your Adventure</span>
				</a>
			</div>
		</div>
	</section>
</div>






