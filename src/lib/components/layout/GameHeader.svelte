<script lang="ts">
	interface Props {
		character: any;
	}

	let { character }: Props = $props();
</script>

<header class="bg-surface-200 dark:bg-surface-800 text-surface-900 dark:text-surface-100 p-4 shadow-md">
	{#if character}
		<div class="flex items-center justify-between">
			<div>
				<span class="text-primary-600 dark:text-primary-400">{character.name}</span>
				<span class="ml-2">Health: 100%</span>
			</div>
		</div>
	{:else}
		<h1 class="text-2xl font-semibold">The Corelight Fall</h1>
	{/if}
</header>
