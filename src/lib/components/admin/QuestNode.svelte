<script lang="ts">
	import IconFlag from '@lucide/svelte/icons/flag';
	import IconStar from '@lucide/svelte/icons/star';
	import { Handle, Position } from '@xyflow/svelte';
	
	interface Props {
		data: any;
	}

	let { data }: Props = $props();
</script>

<div
	class="text-surface-900 dark:text-surface-100 min-w-[120px] rounded-lg border-2 border-emerald-300 bg-gradient-to-br from-emerald-400/80 to-emerald-700/80 px-4 py-2 text-center shadow"
>
	<Handle type="target" position={Position.Left} />
	<div class="flex items-center justify-center gap-2 text-lg font-bold">
		<span>
			{#if data.isMain}
				<IconStar size={18} class="text-amber-300" />
			{:else}
				<IconFlag size={18} class="text-emerald-300" />
			{/if}
		</span>
		{data.label}
	</div>
	{#if data.isMain}
		<div class="text-xs font-semibold text-amber-400">Main Quest</div>
	{/if}
	<Handle type="source" position={Position.Right} />
</div>






