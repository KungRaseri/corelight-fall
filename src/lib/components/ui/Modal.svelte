<script lang="ts">
	const { open, onClose, children } = $props();
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
		role="dialog"
		tabindex="0"
		aria-modal="true"
		onclick={onClose}
		onkeydown={(e) => {
			if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
				onClose();
			}
		}}
	>
		<div
			class="bg-surface-800 relative w-full max-w-lg rounded-lg p-6 shadow-lg"
			onclick={(e) => e.stopPropagation()}
			role="none"
		>
			<button class="btn btn-xs absolute top-2 right-2" type="button" onclick={onClose}>✕</button>
			{@render children()}
		</div>
	</div>
{/if}






