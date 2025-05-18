<script lang="ts">
    export let selectedLocation: { name: string; description: string };

    function close() {
        const event = new CustomEvent('close', { bubbles: true });
        dispatchEvent(event);
    }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-surface-800 p-4 text-surface-100 rounded w-80">
        <h2 class="text-xl font-bold">{selectedLocation.name}</h2>
        <p>{selectedLocation.description}</p>
        <div class="mt-4">
            <button class="btn btn-primary" on:click={close}>Close</button>
        </div>
    </div>
</div>
