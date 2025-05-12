<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div
	class="bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8"
>
	<div class="text-center sm:mx-auto sm:w-full sm:max-w-sm">
		<h2 class="text-2xl font-bold tracking-tight text-white">Create your account</h2>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
		<form
			method="POST"
			action="?/register"
			use:enhance
			class="bg-surface-100 dark:bg-surface-800 space-y-6 rounded-lg p-8 shadow-md"
		>
			<div>
				<label for="username" class="block text-sm font-medium text-white">Username</label>
				<input
					type="text"
					name="username"
					id="username"
					required
					class="input input-primary mt-2 w-full"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-white">Password</label>
				<input
					type="password"
					name="password"
					id="password"
					required
					class="input input-primary mt-2 w-full"
				/>
			</div>

			<div>
				<button type="submit" class="btn btn-primary w-full">Register</button>
			</div>

			<p class="text-surface-300 mt-4 text-center text-sm">
				Already have an account? <a href="/auth/login" class="text-primary-600 hover:underline"
					>Login here</a
				>
			</p>

			{#if form?.message}
				<p class="text-error-500 mt-4 text-center text-sm">{form.message}</p>
			{/if}
		</form>
	</div>
</div>
