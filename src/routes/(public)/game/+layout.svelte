<script lang="ts">
	import GameHeader from '$lib/components/layout/GameHeader.svelte';
	import MobileNav from '$lib/components/layout/MobileNav.svelte';

	let { data, children } = $props();
</script>

<div class="game-layout bg-surface-900 text-surface-100 flex h-full w-full flex-col">
	<!-- Game Header -->
	<div class="w-full flex-auto">
		<GameHeader character={data.character} />
	</div>

	<!-- Main Game Content (no sidebar) -->
	<main class="flex flex-auto overflow-auto p-4">
		<div class="flex w-full flex-auto">
			{@render children()}
		</div>
	</main>
</div>
