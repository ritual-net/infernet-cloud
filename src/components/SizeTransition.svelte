<script lang="ts">
	// Internal state
	let borderBoxSize: ResizeObserverSize[];
</script>

<div
	class="size-transition"
	style={`
		--blockSize: ${borderBoxSize?.[0].blockSize}px;
	`}
>
	<div bind:borderBoxSize>
		<slot />
	</div>
</div>

<style>
	.size-transition {
		contain: size;
		contain-intrinsic-block-size: auto var(--blockSize);
		transition: contain-intrinsic-block-size 0.3s var(--transition-easeOutExpo);
	}
</style>
