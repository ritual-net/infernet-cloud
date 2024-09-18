<script lang="ts">
	// Inputs
	export let icon: string | ConstructorOfATypedSvelteComponent | undefined
	export let alt: string | undefined
	export let value: string | undefined
</script>


<div class="row">
	<slot name="icon">
		{#if typeof icon === 'string'}
			<img
				src={icon}
				{alt}
			/>
		{:else if icon}
			<svelte:component this={icon} />
		{/if}
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
