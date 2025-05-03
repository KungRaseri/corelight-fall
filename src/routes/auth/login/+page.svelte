<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Login from '@lucide/svelte/icons/log-in';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<Login class="mx-auto"/>
		<h2 class="text-center text-2xl/9 font-bold tracking-tight text-white">
			Sign in to your account
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6" method="post" action="?/login" use:enhance>
			<div>
				<label for="username" class="block text-sm/6 font-medium text-white">Username</label>
				<div class="mt-2">
					<input
						type="username"
						name="username"
						id="username"
						autocomplete="username"
						required
						class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
					/>
				</div>
			</div>

			<div>
				<div class="flex items-center justify-between">
					<label for="password" class="block text-sm/6 font-medium text-white">Password</label>
					<div class="text-sm">
						<a href="#" class="font-semibold text-indigo-400 hover:text-indigo-300"
							>Forgot password?</a
						>
					</div>
				</div>
				<div class="mt-2">
					<input
						type="password"
						name="password"
						id="password"
						autocomplete="current-password"
						required
						class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
					>Sign in</button
				>
			</div>
		</form>

		<button formaction="?/register">Register</button>

		<p style="color: red">{form?.message ?? ''}</p>
	</div>
</div>
