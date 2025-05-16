<script lang="ts">
	import GameHeader from '$lib/components/GameHeader.svelte';
	import GameActions from '$lib/components/GameActions.svelte';
	import GameLog from '$lib/components/GameLog.svelte';

	let { data, children } = $props();
</script>

<div class="game-layout bg-surface-900 text-surface-100 flex h-full flex-col">
	<!-- Game Header -->
	<GameHeader character={data.character} />

	<!-- Main Game Content -->
	<main class="flex-1 overflow-auto p-4">
		{@render children()}
	</main>
</div>
