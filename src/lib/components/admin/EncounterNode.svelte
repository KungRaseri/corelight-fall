<script lang="ts">
	import IconSword from '@lucide/svelte/icons/sword';
	import IconUsers from '@lucide/svelte/icons/users';
	import IconBookOpen from '@lucide/svelte/icons/book-open';
	import IconPuzzle from '@lucide/svelte/icons/puzzle';
	import IconMap from '@lucide/svelte/icons/map';
	import { Handle, Position } from '@xyflow/svelte';
	
	interface Props {
		data: any;
	}

	let { data }: Props = $props();
</script>

<div
	class="text-surface-900 dark:text-surface-100 min-w-[120px] rounded-lg border-2 border-sky-300 bg-gradient-to-br from-sky-400/80 to-sky-700/80 px-4 py-2 text-center shadow"
>
	<Handle type="target" position={Position.Left} />
	<div class="flex items-center justify-center gap-2 text-base font-bold">
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
	<Handle type="source" position={Position.Right} />
</div>






