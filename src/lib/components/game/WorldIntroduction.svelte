<script lang="ts">
	interface Props {
		onContinue: () => void;
	}

	let { onContinue }: Props = $props();
</script>

<div class="mx-auto max-w-4xl space-y-8">
	<!-- Title -->
	<div class="text-center">
		<h1 class="mb-4 text-4xl md:text-5xl font-bold text-primary-500 dark:text-primary-400">
			The World of Corelight Fall
		</h1>
		<p class="text-lg text-surface-600 dark:text-surface-400">
			A realm shrouded in twilight, where the gods have fallen silent...
		</p>
	</div>

	<!-- Content Sections -->
	<div class="space-y-6">
		<!-- The Fall -->
		<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-6 md:p-8">
			<h2 class="mb-4 text-2xl font-bold text-primary-500 dark:text-primary-400">
				The Fall
			</h2>
			<div class="space-y-4 text-surface-700 dark:text-surface-300 leading-relaxed">
				<p>
					Centuries ago, the <span class="font-semibold text-primary-500 dark:text-primary-400">Corelight</span> sustained vast cities, miraculous technology, and the very fabric of reality itself. Divine energy flowed through crystalline conduits, powering machines that seemed like magic to mortal eyes.
				</p>
				<p>
					Then came the Fall. The Corelight dimmed, the gods fell silent, and the world was plunged into an age of ash and decay. Great cities crumbled, their technologies failing without the divine spark that powered them.
				</p>
			</div>
		</div>

		<!-- The Twilight Age -->
		<div class="card preset-outlined-surface-200-800 bg-surface-100 dark:bg-surface-800 p-6 md:p-8">
			<h2 class="mb-4 text-2xl font-bold text-primary-500 dark:text-primary-400">
				The Twilight Age
			</h2>
			<div class="space-y-4 text-surface-700 dark:text-surface-300 leading-relaxed">
				<p>
					Now, humanity clings to survival in scattered outposts, built among the ruins of the old world. The <span class="font-semibold text-secondary-500 dark:text-secondary-400">Cinderlight Conclave</span>, <span class="font-semibold text-secondary-500 dark:text-secondary-400">Forgewalkers Union</span>, and other factions struggle to preserve what little knowledge remains.
				</p>
				<p>
					Some seek to restore the Corelight. Others believe it should stay dormant, lest humanity repeat the mistakes of the past. And still others whisper of darker powers, ancient evils awakening in the world's twilight.
				</p>
			</div>
		</div>

		<!-- Your Role -->
		<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-6 md:p-8">
			<h2 class="mb-4 text-2xl font-bold text-primary-500 dark:text-primary-400">
				Your Journey Begins
			</h2>
			<div class="space-y-4 text-surface-700 dark:text-surface-300 leading-relaxed">
				<p>
					You carry something precious: a <span class="font-semibold text-warning-500 dark:text-warning-400">Signal Beacon</span>, a relic from the old world that still pulses with faint traces of Corelight energy. Its discovery could change everything.
				</p>
				<p class="text-lg font-semibold text-surface-900 dark:text-surface-100">
					The choices you make will shape not just your own fate, but the fate of the entire world.
				</p>
			</div>
		</div>
	</div>

	<!-- Continue Button -->
	<div class="flex justify-center pt-6">
		<button 
			class="btn preset-filled-primary-500 flex items-center gap-2 px-8 py-3 text-lg"
			onclick={onContinue}
		>
			<span>Continue to Prologue</span>
		</button>
	</div>
</div>
