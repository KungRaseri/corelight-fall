<script lang="ts">
	let message = '';

	async function seedDatabase() {
		try {
			const response = await fetch('/api/admin/database/seed', { method: 'POST' });
			const result = await response.json();
			message = result.message;
		} catch (err) {
			message = 'Error seeding the database';
		}
	}

	async function seedTestData() {
		try {
			const response = await fetch('/api/admin/database/seed/test-data', { method: 'POST' });
			const result = await response.json();
			message = result.message;
		} catch (err) {
			message = 'Error seeding the database';
		}
	}

	async function resetDatabase() {
		try {
			const response = await fetch('/api/admin/database/reset', { method: 'POST' });
			const result = await response.json();
			message = result.message;
		} catch (err) {
			message = 'Error resetting the database';
		}
	}
</script>

<section class="p-6">
	<h1 class="mb-4 text-2xl font-bold">Database Management</h1>

	<div class="space-y-4">
		<button class="btn btn-primary" onclick={seedDatabase}>Seed Database</button>
		<button class="btn" onclick={seedTestData}>Seed Test Data</button>
		<button class="btn btn-secondary" onclick={resetDatabase}>Reset Database</button>

		{#if message}
			<p class="mt-4 text-green-500">{message}</p>
		{/if}
	</div>
</section>
