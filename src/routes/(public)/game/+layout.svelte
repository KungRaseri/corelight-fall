<script lang="ts">
	import GameHeader from '$lib/components/layout/GameHeader.svelte';

	let { data, children } = $props();
</script>

<div class="game-layout bg-surface-100 dark:bg-surface-900 text-surface-900 dark:text-surface-100 flex h-full w-full flex-col">
	<!-- Game Header -->
	<div class="w-full flex-row">
		<GameHeader character={data.character} />
	</div>

	<!-- Main Game Content (no sidebar) -->
	<main class="flex-row p-4">
		{@render children()}
	</main>
</div>






