<script lang="ts">
	import '../app.css';

	import AppBar from '$lib/components/AppBar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import MobileNav from '$lib/components/MobileNav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ToastNotifications from '$lib/components/ToastNotifications.svelte';

	let { children } = $props();
</script>

<div class="bg-surface-950 text-surface-100 font-base min-h-screen transition-all">
	<!-- Sidebar (desktop) -->
	<div class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72">
		<Sidebar />
	</div>

	<!-- Content wrapper -->
	<div class="pl-24 lg:pl-60">
		<!-- AppBar -->
		<AppBar />

		<!-- Main content -->
		<main class="py-10">
			<div class="px-4 sm:px-6 lg:px-8">
				{@render children()}
			</div>
		</main>

		<!-- Footer -->
		<Footer />
	</div>

	<!-- Mobile Nav -->
	<div class="lg:hidden">
		<MobileNav />
	</div>

	<!-- Toast Notifications -->
	<ToastNotifications />
</div>
