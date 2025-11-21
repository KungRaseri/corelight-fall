<script lang="ts">
	import Modal from '../../../../src/lib/components/ui/Modal.svelte';

	const { open, onClose, content } = $props();
</script>

<Modal {open} {onClose}>
	{content}
</Modal>
