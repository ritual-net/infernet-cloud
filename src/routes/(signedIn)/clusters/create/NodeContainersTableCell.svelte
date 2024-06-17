<script context="module" lang="ts">
	export enum CellType {
		ContainerIdAndDescription,
		ImageAndCommand,
	}
</script>


<script lang="ts">
	// Types/constants
	import type { Container } from '$schema/interfaces'


	// Inputs
	export let container: Container
	export let cellType: CellType
</script>


{#if cellType === CellType.ContainerIdAndDescription}
	<p class="container-id">{container.container_id}</p>

	<p class="description">
		{container.description}
	</p>

{:else if cellType === CellType.ImageAndCommand}
	<p class="image">{container.image}</p>

	<p class="command">
		{container.command}
	</p>
{/if}


<style>
	p {
		font-size: 0.8em;
	}

	.description {
		overflow: auto;
		max-height: 6lh;
	}

	.row {
		justify-content: start;
	}

	img {
		width: 1.5em;
		height: 1.5em;
	}
</style>
