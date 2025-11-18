<script lang="ts">
	import { BaseEdge, getBezierPath } from '@xyflow/svelte';
	const {
		id,
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
		style,
		markerEnd
	} = $props();

	const edgeColor = style?.stroke || '#a3a3a3';

	const edgePath = $derived(
		() =>
			getBezierPath({
				sourceX,
				sourceY,
				sourcePosition,
				targetX,
				targetY,
				targetPosition
			})[0]
	);
</script>

<BaseEdge {id} path={edgePath()} {style} color={edgeColor} {markerEnd} />






