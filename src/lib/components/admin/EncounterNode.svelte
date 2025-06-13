<script lang="ts">
	import IconSword from '@lucide/svelte/icons/sword';
	import IconUsers from '@lucide/svelte/icons/users';
	import IconBookOpen from '@lucide/svelte/icons/book-open';
	import IconPuzzle from '@lucide/svelte/icons/puzzle';
	import IconMap from '@lucide/svelte/icons/map';
	import { Handle } from '@xyflow/svelte';
	export let data: any;
</script>

<div class="rounded-lg shadow bg-gradient-to-br from-sky-400/80 to-sky-700/80 border-2 border-sky-300 px-4 py-2 min-w-[120px] text-center text-surface-900-100 dark:text-surface-100-900">
	<Handle type="target" position="left" />
	<div class="font-bold text-base flex items-center justify-center gap-2">
		<span>
			{#if data.type === 'combat'}
				<IconSword size={16} class="text-sky-200" />
			{:else if data.type === 'dialogue'}
				<IconUsers size={16} class="text-sky-200" />
			{:else if data.type === 'story'}
				<IconBookOpen size={16} class="text-sky-200" />
			{:else if data.type === 'puzzle'}
				<IconPuzzle size={16} class="text-sky-200" />
			{:else}
				<IconMap size={16} class="text-sky-200" />
			{/if}
		</span>
		{data.label}
	</div>
	<Handle type="source" position="right" />
</div>
