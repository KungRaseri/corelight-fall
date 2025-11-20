<script lang="ts">
	interface Props {
		onContinue: () => void;
	}

	let { onContinue }: Props = $props();
</script>

<div class="mx-auto max-w-4xl space-y-8">
	<!-- Title -->
	<div class="text-center mb-8">
		<h1 class="mb-4 text-4xl md:text-5xl font-bold text-primary-500 dark:text-primary-400">
			The Signal
		</h1>
		<p class="text-lg text-surface-600 dark:text-surface-400 italic">
			Three days ago, you found the beacon...
		</p>
	</div>

	<!-- Story Content -->
	<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-6 md:p-10 space-y-6">
		<div class="prose prose-lg dark:prose-invert max-w-none space-y-4 text-surface-700 dark:text-surface-300 leading-relaxed">
			<p>
				The ruins stretched endlessly in every direction, jagged spires of metal and stone clawing at the ash-choked sky. You'd been scavenging for weeks, finding little more than rust and bones.
			</p>
			
			<p>
				Then you heard it: a rhythmic pulse, like a heartbeat, echoing from deep within a collapsed structure. Following the sound, you descended into darkness, your torch barely piercing the gloom.
			</p>

			<p>
				In a chamber of twisted metal and shattered glass, you found it. The <span class="font-semibold text-warning-500 dark:text-warning-400">Signal Beacon</span> sat atop a pedestal of fused machinery, its surface etched with patterns that seemed to shift in the torchlight. When you touched it, the pulse quickened—and the chamber came alive with light.
			</p>

			<p>
				Ancient screens flickered. Machinery groaned. And in the distance, something stirred.
			</p>

			<p class="text-lg font-semibold text-surface-900 dark:text-surface-100 pt-4 border-t border-surface-300 dark:border-surface-700">
				You fled with the beacon, knowing that whatever it was, it was important. The pulse guides you now, leading you toward <span class="text-primary-500 dark:text-primary-400">Cinderlight Outpost</span>—a place where answers might be found.
			</p>

			<p class="italic text-surface-600 dark:text-surface-400">
				But you're not the only one searching for relics of the old world...
			</p>
		</div>
	</div>

	<!-- Continue Button -->
	<div class="flex justify-center pt-6">
		<button 
			class="btn preset-filled-primary-500 flex items-center gap-2 px-8 py-3 text-lg"
			onclick={onContinue}
		>
			<span>Begin Your Journey</span>
		</button>
	</div>
</div>
