<script lang="ts">
	export let act = { id: null, title: '', order: 0 };
	export let loading = false;
	export let onSave: (act) => void;
	export let onCancel: () => void;

	let actData = { ...act };

	function handleSubmit(e: Event) {
		e.preventDefault();
		onSave({ ...actData });
	}
</script>

<form class="space-y-6" on:submit={handleSubmit}>
	<h2 class="text-xl font-bold">{actData.id ? 'Edit Act' : 'New Act'}</h2>
	<div>
		<label class="mb-1 block font-semibold" for="title">Title</label>
		<input
			id="title"
			type="text"
			class="input input-bordered w-full"
			bind:value={actData.title}
			required
		/>
	</div>
	<div>
		<label class="mb-1 block font-semibold" for="order">Order</label>
		<input
			id="order"
			type="number"
			class="input input-bordered w-full"
			bind:value={actData.order}
			min="0"
		/>
	</div>
	<div class="flex gap-4">
		<button class="btn btn-primary" type="submit" disabled={loading}>
			{loading ? 'Saving...' : 'Save Act'}
		</button>
		<button class="btn btn-secondary" type="button" on:click={onCancel}>Cancel</button>
	</div>
</form>
