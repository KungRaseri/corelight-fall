<script lang="ts">
	import IconGitBranch from '@lucide/svelte/icons/git-branch';
	import { Handle } from '@xyflow/svelte';
	export let data: any;
</script>

<div
	class="text-surface-900-100 dark:text-surface-100-900 min-w-[120px] rounded-lg border-2 border-amber-300 bg-gradient-to-br from-amber-400/80 to-amber-700/80 px-4 py-2 text-center shadow"
>
	<Handle type="target" position="left" />
	<div class="flex items-center justify-center gap-2 text-base font-semibold">
		<span>
			<IconGitBranch size={16} class="text-amber-300" />
		</span>
		{data.label}
	</div>
	<Handle type="source" position="right" />
</div>
