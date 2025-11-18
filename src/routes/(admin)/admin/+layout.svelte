<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import '../../../app.css';

	import Sidebar from '$lib/components/admin/Sidebar.svelte';
	import NavBar from '$lib/components/admin/NavBar.svelte';
	import Footer from '$lib/components/admin/Footer.svelte';

	const { children } = $props();
</script>

<div class="bg-surface-50-950 text-surface-900-100 flex h-screen">
	<Sidebar />
	<div class="flex flex-1 flex-col">
		<NavBar />
		<main class="flex-1 overflow-auto p-6">
			{@render children()}
		</main>
		<Footer />
	</div>
</div>






