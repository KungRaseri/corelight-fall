<script lang="ts">
	const { phase, act, onSave, onCancel, loading } = $props();

	let phaseData = $state({ ...phase });

	function handleSubmit(e: Event) {
		e.preventDefault();
		onSave({ ...phaseData });
	}
</script>

<div class="card bg-surface-200-800 text-surface-900-100 mx-auto max-w-md shadow-lg">
	<form class="space-y-6 p-6" onsubmit={handleSubmit}>
		<h2 class="text-xl font-bold">{phaseData.id ? 'Edit Phase' : 'New Phase'}</h2>
		<div>
			<label class="mb-1 block font-semibold" for="act">Act</label>
			<input class="input input-bordered w-full" type="text" value={act.title} disabled />
			<input type="hidden" name="actId" value={act.id} />
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="title">Title</label>
			<input
				id="title"
				type="text"
				class="input input-bordered w-full"
				bind:value={phaseData.title}
				required
			/>
		</div>
		<div>
			<label class="mb-1 block font-semibold" for="order">Order</label>
			<input
				id="order"
				type="number"
				class="input input-bordered w-full"
				bind:value={phaseData.order}
				min="0"
			/>
		</div>
		<div class="flex gap-4">
			<button class="btn preset-filled-primary-500" type="submit" disabled={loading}>
				{loading ? 'Saving...' : 'Save Phase'}
			</button>
			<button class="btn preset-tonal-secondary" type="button" onclick={onCancel}>Cancel</button>
		</div>
	</form>
</div>






