<script lang="ts">
	// Inputs
	export let icon: string
	export let alt: string | undefined
	export let value: string
</script>


<div class="row">
	<img
		src={icon}
		{alt}
	/>
	{value}
</div>


<style>
	.row {
		justify-content: start;
	}

	img {
		width: 1.5em;
		height: 1.5em;
	}
</style>
