<script lang="ts">
	// Internal state
	let borderBoxSize: ResizeObserverSize[]
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
		@supports (contain-intrinsic-block-size: auto) {
			contain: size;
			contain-intrinsic-block-size: auto var(--blockSize);
			transition: contain-intrinsic-block-size 0.3s var(--transition-easeOutExpo);
			will-change: contain-intrinsic-block-size;
		}

		@supports not (contain-intrinsic-block-size: auto) {
			clip-path: inset(calc(-1 * var(--borderWidth)));
			height: var(--blockSize);
			transition: height 0.3s var(--transition-easeOutExpo);
			will-change: height;
		}
	}
</style>
