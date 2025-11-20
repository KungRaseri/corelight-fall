<script lang="ts">
	import GameHeader from '$lib/components/layout/GameHeader.svelte';

	let { data, children } = $props();
</script>

<div class="flex h-full w-full flex-col bg-surface-50 dark:bg-surface-950">
	<!-- Game Header -->
	<GameHeader character={data.character} />

	<!-- Main Game Content -->
	<main class="flex-1 overflow-y-auto">
		{@render children()}
	</main>
</div>






