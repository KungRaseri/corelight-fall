<script lang="ts">
	import '../../app.css';

	import AppBar from '$lib/components/layout/AppBar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import ToastNotifications from '$lib/components/layout/ToastNotifications.svelte';

	import { sidebarExpanded } from '$lib/stores/sidebar';
	import { setUser, user } from '$lib/stores/user';
	import { onMount } from 'svelte';
	import { character, setCharacter } from '$lib/stores/character';

	const { data, children } = $props();

	onMount(() => {
		if (data?.user) {
			setUser(data.user);
		}
	});
</script>

<div class="bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100 min-h-screen transition-colors">
	<!-- Content wrapper -->
	<div class="flex flex-col min-h-screen">
		<!-- AppBar -->
		<AppBar />

		<!-- Main content -->
		<main class="flex-1">
			{@render children()}
		</main>

		<!-- Footer -->
		<Footer />
	</div>

	<!-- Toast Notifications -->
	<ToastNotifications />
</div>






