<script lang="ts">
	const { act, onSave, onCancel, loading } = $props();

	let actData = { ...act };

	function handleSubmit(e: Event) {
		e.preventDefault();
		onSave({ ...actData });
	}
</script>

<div class="card bg-surface-200-800 text-surface-900-100 mx-auto max-w-md shadow-lg">
	<form class="space-y-6 p-6" onsubmit={handleSubmit}>
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
			<button class="btn btn-secondary" type="button" onclick={onCancel}>Cancel</button>
		</div>
	</form>
</div>
