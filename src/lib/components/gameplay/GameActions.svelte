<script lang="ts">
    function explore() {
        alert("Exploring...");
    }

    function fight() {
        alert("Fighting...");
    }

    function useItem() {
        alert("Using item...");
    }
</script>

<div class="bg-surface-800 p-4 text-surface-100 shadow-md flex gap-4 justify-center">
    <button class="btn btn-primary" onclick={explore}>Explore</button>
    <button class="btn btn-danger" onclick={fight}>Fight</button>
    <button class="btn btn-secondary" onclick={useItem}>Use Item</button>
</div>
