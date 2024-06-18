<script context="module" lang="ts">
	export enum CellType {
		ContainerIdAndDescription,
		ImageAndCommand,
	}
</script>


<script lang="ts">
	// Types/constants
	import type { InferType } from 'yup'
	import type { Container } from './schema'


	// Inputs
	export let container: InferType<typeof Container>
	export let cellType: CellType
</script>


{#if cellType === CellType.ContainerIdAndDescription}
	<div>{container.container_id}</div>

	<p class="description">
		{container.description}
	</p>

{:else if cellType === CellType.ImageAndCommand}
	<div>{container.image}</div>

	<p class="command">
		<code>{container.command}</code>
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
