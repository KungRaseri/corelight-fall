<script lang="ts">
	let message = $state('');
	let isLoading = $state(false);

	async function seedDatabase() {
		isLoading = true;
		message = '';
		try {
			const response = await fetch('/api/admin/database/seed', { method: 'POST' });
			const result = await response.json();
			message = result.message;
		} catch (err) {
			message = 'Error seeding the database';
		} finally {
			isLoading = false;
		}
	}

	async function seedTestData() {
		isLoading = true;
		message = '';
		try {
			const response = await fetch('/api/admin/database/seed/test-data', { method: 'POST' });
			const result = await response.json();
			message = result.message;
		} catch (err) {
			message = 'Error seeding the database';
		} finally {
			isLoading = false;
		}
	}

	async function resetDatabase() {
		if (!confirm('⚠️ WARNING: This will delete ALL data including your admin user! You will be logged out. Are you sure?')) {
			return;
		}
		isLoading = true;
		message = '';
		try {
			const response = await fetch('/api/admin/database/reset', { method: 'POST' });
			const result = await response.json();
			message = result.message + ' (You will need to log in again)';
			// Redirect to login after a delay
			setTimeout(() => {
				window.location.href = '/auth/login';
			}, 2000);
		} catch (err) {
			message = 'Error resetting the database';
		} finally {
			isLoading = false;
		}
	}

	async function resetAndSeed() {
		if (!confirm('⚠️ This will delete all data and re-seed the database. You will be logged out. Continue?')) {
			return;
		}
		isLoading = true;
		message = '';
		try {
			const response = await fetch('/api/admin/database/reset-and-seed', { method: 'POST' });
			const result = await response.json();
			message = result.message + ' (Redirecting to login...)';
			// Redirect to login after a delay
			setTimeout(() => {
				window.location.href = '/auth/login';
			}, 2000);
		} catch (err) {
			message = 'Error resetting and seeding the database';
		} finally {
			isLoading = false;
		}
	}
</script>

<section class="p-6">
	<h1 class="mb-4 text-3xl font-bold text-primary-500 dark:text-primary-400">Database Management</h1>

	<div class="space-y-4">
		<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-4">
			<h2 class="mb-2 text-xl font-bold">Recommended: Reset & Seed</h2>
			<p class="text-surface-700 dark:text-surface-300 mb-4 text-sm">
				Clears all data and re-seeds the database with initial data. This is the safest option.
			</p>
			<button 
				class="btn preset-filled-primary flex items-center gap-2" 
				onclick={resetAndSeed}
				disabled={isLoading}
			>
				{isLoading ? 'Processing...' : 'Reset & Seed Database'}
			</button>
		</div>

		<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-4">
			<h2 class="mb-2 text-xl font-bold">Advanced Options</h2>
			<p class="text-surface-700 dark:text-surface-300 mb-4 text-sm">
				Use these carefully. Resetting without seeding will log you out!
			</p>
			<div class="flex gap-2">
				<button 
					class="btn preset-tonal-primary" 
					onclick={seedDatabase}
					disabled={isLoading}
				>
					Seed Database
				</button>
				<button 
					class="btn preset-tonal-surface" 
					onclick={seedTestData}
					disabled={isLoading}
				>
					Seed Test Data
				</button>
				<button 
					class="btn preset-tonal-error" 
					onclick={resetDatabase}
					disabled={isLoading}
				>
					⚠️ Reset Only (Dangerous)
				</button>
			</div>
		</div>

		{#if message}
			<div class="card preset-filled-success p-4">
				<p class="text-success-contrast-500">{message}</p>
			</div>
		{/if}
	</div>
</section>






