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
			message = 'Error seeding test data';
		} finally {
			isLoading = false;
		}
	}

	async function resetGameData() {
		if (!confirm('⚠️ This will delete all game data (storylines, quests, encounters, items, characters, blog posts) but preserve user accounts. Continue?')) {
			return;
		}
		isLoading = true;
		message = '';
		try {
			const response = await fetch('/api/admin/database/reset-game-data', { method: 'POST' });
			const result = await response.json();
			message = result.message;
			// Reload page to refresh state
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		} catch (err) {
			message = 'Error resetting game data';
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
	<h1 class="mb-6 text-3xl font-bold text-primary-500 dark:text-primary-400">Database Management</h1>

	<div class="space-y-6">
		<!-- Recommended: Reset Game Data & Seed -->
		<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-6">
			<div class="flex items-start gap-4">
				<div class="flex-1">
					<h2 class="mb-2 text-xl font-bold text-surface-900 dark:text-surface-100">
						✅ Recommended: Reset & Seed Game Data
					</h2>
					<p class="text-surface-700 dark:text-surface-300 mb-4 text-sm">
						Clears all game content (storylines, quests, encounters, items, characters, blog posts) 
						and re-seeds with fresh data. <strong>User accounts, roles, and permissions are preserved.</strong>
						You will remain logged in.
					</p>
					<div class="bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700 rounded-lg p-3 mb-4">
						<p class="text-sm text-primary-800 dark:text-primary-200">
							<strong>Safe for development:</strong> This is the safest option for testing. 
							All users can continue using their accounts after the reset.
						</p>
					</div>
					<button 
						class="btn preset-filled-primary flex items-center gap-2" 
						onclick={resetGameData}
						disabled={isLoading}
					>
						{isLoading ? 'Processing...' : 'Reset & Seed Game Data'}
					</button>
				</div>
			</div>
		</div>

		<!-- Seeding Options -->
		<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-6">
			<h2 class="mb-3 text-xl font-bold text-surface-900 dark:text-surface-100">Seeding Options</h2>
			<p class="text-surface-700 dark:text-surface-300 mb-4 text-sm">
				Add data to the database without deleting existing data. Use these when you want to add more content.
			</p>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				<div class="card preset-outlined-surface-200-800 bg-surface-100 dark:bg-surface-800 p-4">
					<h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-2">Seed Initial Data</h3>
					<p class="text-xs text-surface-600 dark:text-surface-400 mb-3">
						Adds roles, permissions, attributes, regions, locations, factions, admin user, 
						blog posts, items, and the main storyline.
					</p>
					<button 
						class="btn preset-tonal-primary w-full" 
						onclick={seedDatabase}
						disabled={isLoading}
					>
						Seed Database
					</button>
				</div>
				<div class="card preset-outlined-surface-200-800 bg-surface-100 dark:bg-surface-800 p-4">
					<h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-2">Seed Test Data</h3>
					<p class="text-xs text-surface-600 dark:text-surface-400 mb-3">
						Adds additional test items and sample character equipment for development testing.
					</p>
					<button 
						class="btn preset-tonal-surface w-full" 
						onclick={seedTestData}
						disabled={isLoading}
					>
						Seed Test Data
					</button>
				</div>
			</div>
		</div>

		<!-- Danger Zone -->
		<div class="card preset-outlined-error-500 bg-error-50 dark:bg-error-950/20 p-6 border-2">
			<h2 class="mb-3 text-xl font-bold text-error-700 dark:text-error-400">⚠️ Danger Zone</h2>
			<p class="text-error-800 dark:text-error-300 mb-4 text-sm">
				<strong>Warning:</strong> These operations will log you out and require re-authentication.
				Use with extreme caution!
			</p>
			
			<div class="space-y-3">
				<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-4">
					<h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-2">
						Full Reset & Seed
					</h3>
					<p class="text-xs text-surface-600 dark:text-surface-400 mb-3">
						Deletes <strong>everything</strong> (including users) and re-seeds with fresh data. 
						Admin user will be recreated with default password.
					</p>
					<button 
						class="btn preset-filled-warning flex items-center gap-2" 
						onclick={resetAndSeed}
						disabled={isLoading}
					>
						{isLoading ? 'Processing...' : '⚠️ Full Reset & Seed'}
					</button>
				</div>

				<div class="card preset-glass-surface bg-surface-50 dark:bg-surface-900 p-4">
					<h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-2">
						Nuclear Reset (No Seed)
					</h3>
					<p class="text-xs text-surface-600 dark:text-surface-400 mb-3">
						Deletes <strong>all data</strong> without re-seeding. Database will be completely empty. 
						Only use if you know what you're doing!
					</p>
					<button 
						class="btn preset-filled-error flex items-center gap-2" 
						onclick={resetDatabase}
						disabled={isLoading}
					>
						{isLoading ? 'Processing...' : '🔥 Nuclear Reset'}
					</button>
				</div>
			</div>
		</div>

		<!-- Status Message -->
		{#if message}
			<div class="card preset-filled-success p-4">
				<p class="text-success-contrast-500 font-semibold">{message}</p>
			</div>
		{/if}

		<!-- Information Panel -->
		<div class="card preset-tonal-surface p-6">
			<h2 class="mb-3 text-xl font-bold text-surface-900 dark:text-surface-100">📚 Database Information</h2>
			<div class="space-y-2 text-sm text-surface-700 dark:text-surface-300">
				<div class="flex gap-2">
					<span class="font-semibold min-w-32">User Data:</span>
					<span>Users, roles, permissions, sessions</span>
				</div>
				<div class="flex gap-2">
					<span class="font-semibold min-w-32">Game Data:</span>
					<span>Attributes, regions, locations, factions</span>
				</div>
				<div class="flex gap-2">
					<span class="font-semibold min-w-32">Content Data:</span>
					<span>Acts, phases, storylines, quests, encounters, choices, blog posts, items</span>
				</div>
				<div class="flex gap-2">
					<span class="font-semibold min-w-32">Character Data:</span>
					<span>Characters, character attributes, equipment, inventory, progress</span>
				</div>
			</div>
		</div>
	</div>
</section>






