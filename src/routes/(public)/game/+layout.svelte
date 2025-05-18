<script lang="ts">
	import GameHeader from '$lib/components/layout/GameHeader.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import MobileNav from '$lib/components/layout/MobileNav.svelte';

	let { data, children } = $props();
</script>

<div class="game-layout bg-surface-900 text-surface-100 flex h-full w-full flex-col">
	<!-- Game Header -->
	<div class="w-full flex-auto">
		<GameHeader character={data.character} />
	</div>

	<!-- Main Game Content -->
	<main class="flex flex-auto overflow-auto p-4">
		{#if data.character}
			<!-- Sidebar (desktop) -->
			<div class="hidden h-full lg:flex lg:w-72">
				<Sidebar />
			</div>
		{/if}

		<div class="flex flex-auto">
			{@render children()}
		</div>
	</main>

	<!-- Mobile Nav -->
	<div class="lg:hidden">
		<MobileNav />
	</div>
</div>
