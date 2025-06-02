<script lang="ts">
    export let phase = { id: null, actId: null, title: '', order: 0 };
    export let acts: any[] = [];
    export let loading = false;
    export let onSave: (phase) => void;
    export let onCancel: () => void;

    let phaseData = { ...phase };

    function handleSubmit(e: Event) {
        e.preventDefault();
        onSave({ ...phaseData });
    }
</script>

<form class="space-y-6" on:submit={handleSubmit}>
    <h2 class="text-xl font-bold">{phaseData.id ? 'Edit Phase' : 'New Phase'}</h2>
    <div>
        <label class="block font-semibold mb-1" for="act">Act</label>
        <select
            id="act"
            class="input input-bordered w-full"
            bind:value={phaseData.actId}
            required
        >
            <option value="" disabled selected>Select act</option>
            {#each acts as act}
                <option value={act.id}>{act.title}</option>
            {/each}
        </select>
    </div>
    <div>
        <label class="block font-semibold mb-1" for="title">Title</label>
        <input
            id="title"
            type="text"
            class="input input-bordered w-full"
            bind:value={phaseData.title}
            required
        />
    </div>
    <div>
        <label class="block font-semibold mb-1" for="order">Order</label>
        <input
            id="order"
            type="number"
            class="input input-bordered w-full"
            bind:value={phaseData.order}
            min="0"
        />
    </div>
    <div class="flex gap-4">
        <button class="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Phase'}
        </button>
        <button class="btn btn-secondary" type="button" on:click={onCancel}>Cancel</button>
    </div>
</form>