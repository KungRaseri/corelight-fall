<script lang="ts">
	function explore() {
		alert('Exploring...');
	}

	function fight() {
		alert('Fighting...');
	}

	function useItem() {
		alert('Using item...');
	}
</script>

<div class="bg-surface-800 text-surface-100 flex justify-center gap-4 p-4 shadow-md">
	<button class="btn preset-filled-primary-500" onclick={explore}>Explore</button>
	<button class="btn btn-danger" onclick={fight}>Fight</button>
	<button class="btn preset-tonal-secondary" onclick={useItem}>Use Item</button>
</div>






