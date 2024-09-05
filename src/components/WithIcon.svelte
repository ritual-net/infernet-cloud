<script lang="ts">
	// Inputs
	export let icon: string | undefined
	export let alt: string | undefined
	export let value: string | undefined
</script>


<div class="row">
	<slot name="icon">
		<img
			src={icon}
			{alt}
		/>
	</slot>

	<slot>
		{value}
	</slot>
</div>


<style>
	.row {
		justify-content: start;
		gap: 0.66em;

		img,
		:global(svg) {
			width: 1.5em;
			height: 1.5em;
		}
	}
</style>
