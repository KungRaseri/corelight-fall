<script lang="ts">
	interface Props {
		onChoice: (arcChoice: 'trust' | 'investigate') => void;
	}

	let { onChoice }: Props = $props();
</script>

<div class="mx-auto max-w-4xl space-y-8">
	<!-- Title -->
	<div class="text-center mb-8">
		<h1 class="mb-4 text-4xl md:text-5xl font-bold text-primary-500 dark:text-primary-400">
			A Choice of Paths
		</h1>
		<p class="text-lg text-surface-600 dark:text-surface-400">
			The beacon has brought you to Cinderlight. Now you must decide how to proceed...
		</p>
	</div>

	<!-- Context -->
	<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-6 md:p-8">
		<div class="space-y-4 text-surface-700 dark:text-surface-300 leading-relaxed">
			<p>
				Elder Cassia has examined the Signal Beacon and revealed its true nature: it's a fragment of the divine network that once connected all of civilization. With it, she believes the Corelight could be restored—or at least understood.
			</p>
			<p>
				But the beacon's activation has attracted unwanted attention. Strange figures watch the outpost from the ruins. The Forgewalkers Union demands the relic be surrendered for study. And deep beneath Cinderlight, ancient machines are beginning to wake...
			</p>
			<p class="text-lg font-semibold text-surface-900 dark:text-surface-100 pt-4">
				Two paths lie before you:
			</p>
		</div>
	</div>

	<!-- Choice Cards -->
	<div class="grid gap-6 md:grid-cols-2">
		<!-- Arc A: Path of Trust -->
		<button
			onclick={() => onChoice('trust')}
			class="card preset-outlined-surface-200-800 hover:preset-tonal-primary p-6 md:p-8 text-left transition-all duration-200 group"
		>
			<div class="mb-4">
				<div class="inline-flex items-center justify-center size-12 rounded-lg bg-primary-500/10 dark:bg-primary-400/10 text-primary-500 dark:text-primary-400 mb-3">
					<svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
				</div>
				<h3 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
					Path of Trust
				</h3>
			</div>
			<p class="text-surface-700 dark:text-surface-300 leading-relaxed mb-4">
				Work with Elder Cassia and the Cinderlight Conclave. Help them unlock the beacon's secrets through cooperation and shared knowledge. This path emphasizes diplomacy, alliance-building, and restoring the old world's wisdom.
			</p>
			<div class="text-sm text-surface-500 dark:text-surface-400">
				<span class="font-semibold">Focus:</span> Diplomacy, Research, Community
			</div>
		</button>

		<!-- Arc B: Path of Investigation -->
		<button
			onclick={() => onChoice('investigate')}
			class="card preset-outlined-surface-200-800 hover:preset-tonal-primary p-6 md:p-8 text-left transition-all duration-200 group"
		>
			<div class="mb-4">
				<div class="inline-flex items-center justify-center size-12 rounded-lg bg-secondary-500/10 dark:bg-secondary-400/10 text-secondary-500 dark:text-secondary-400 mb-3">
					<svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>
				<h3 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2 group-hover:text-secondary-500 dark:group-hover:text-secondary-400 transition-colors">
					Path of Investigation
				</h3>
			</div>
			<p class="text-surface-700 dark:text-surface-300 leading-relaxed mb-4">
				Explore the beacon's mysteries on your own terms. Investigate the ruins, uncover hidden truths, and make your own decisions about what should be shared. This path emphasizes exploration, discovery, and independent judgment.
			</p>
			<div class="text-sm text-surface-500 dark:text-surface-400">
				<span class="font-semibold">Focus:</span> Exploration, Mystery, Independence
			</div>
		</button>
	</div>

	<!-- Note -->
	<div class="card preset-outlined-surface-200-800 bg-surface-100 dark:bg-surface-800 p-4 text-center">
		<p class="text-sm text-surface-600 dark:text-surface-400">
			<span class="font-semibold">Note:</span> This choice will influence your initial storyline, but you'll be able to explore other paths later in your journey.
		</p>
	</div>
</div>
