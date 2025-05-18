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

<div class="bg-surface-950 text-surface-100 font-base min-h-screen transition-all">
	<!-- Content wrapper -->
	<div>
		<!-- AppBar -->
		<AppBar />

		<!-- Main content -->
		<main>
			{@render children()}
		</main>

		<!-- Footer -->
		<Footer />
	</div>

	<!-- Toast Notifications -->
	<ToastNotifications />
</div>
