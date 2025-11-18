<script lang="ts">
	interface Props {
		itemCount: number;
	}

	let { itemCount }: Props = $props();
</script>

<header class="bg-surface-800 dark:bg-surface-900 text-surface-100 dark:text-surface-50 p-4 shadow-md">
	<h2 class="text-2xl font-semibold">Inventory</h2>
	<p>Total Items: {itemCount}</p>
</header>
