<script lang="ts">
	export let character;
</script>

<header class="bg-surface-200-800 text-surface-900-100 p-4 shadow-md">
	{#if character}
		<div class="flex items-center justify-between">
			<div>
				<span class="text-primary-600-400">{character.name}</span>
				<span class="ml-2">Health: 100%</span>
			</div>
		</div>
	{:else}
		<h1 class="text-2xl font-semibold">The Corelight Fall</h1>
	{/if}
</header>
