<script lang="ts">
	// Inputs
	export let icon: string
	export let alt: string | undefined
	export let value: string | undefined
</script>


<div class="row">
	<img
		src={icon}
		{alt}
	/>

	<slot>
		{value}
	</slot>
</div>


<style>
	.row {
		justify-content: start;
		gap: 0.66em;
	}

	img {
		width: 1.5em;
		height: 1.5em;
	}
</style>
