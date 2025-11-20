<script lang="ts">
	import { X, Info, Lightbulb, AlertTriangle } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		title: string;
		message: string;
		variant?: 'info' | 'tip' | 'warning';
		onDismiss: () => void;
	}

	let { title, message, variant = 'info', onDismiss }: Props = $props();

	const variantStyles = {
		info: 'bg-primary-500/10 dark:bg-primary-400/10 border-primary-500/20 dark:border-primary-400/20',
		tip: 'bg-success-500/10 dark:bg-success-400/10 border-success-500/20 dark:border-success-400/20',
		warning:
			'bg-warning-500/10 dark:bg-warning-400/10 border-warning-500/20 dark:border-warning-400/20'
	};

	const iconComponents = {
		info: Info,
		tip: Lightbulb,
		warning: AlertTriangle
	};

	const IconComponent = iconComponents[variant];
</script>

<div
	class="card border-2 p-4 {variantStyles[variant]}"
	transition:slide={{ duration: 300 }}
	role="alert"
	aria-live="polite"
>
	<div class="flex items-start gap-3">
		<div class="flex-shrink-0 mt-0.5">
			<IconComponent class="size-5 text-{variant}-500 dark:text-{variant}-400" />
		</div>
		<div class="flex-1 space-y-1">
			<h3 class="font-bold text-surface-900 dark:text-surface-100">{title}</h3>
			<p class="text-sm text-surface-700 dark:text-surface-300">{message}</p>
		</div>
		<button
			class="btn-icon btn-icon-sm hover:preset-tonal flex-shrink-0"
			onclick={onDismiss}
			aria-label="Dismiss hint"
		>
			<X class="size-4" />
		</button>
	</div>
</div>
