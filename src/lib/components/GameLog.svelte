<script lang="ts">
	let logs = ['You entered the ruins...', 'A shadowy figure appears...'];

	function addLog(message: string) {
		logs = [...logs, message];
	}
</script>

<div class="bg-surface-900 text-surface-300 h-32 overflow-y-auto p-4">
	{#each logs as log}
		<div class="mb-1">{log}</div>
	{/each}
</div>
