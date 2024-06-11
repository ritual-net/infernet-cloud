<script context="module" lang="ts">
	export enum CellType {
		ID,
		NameAndDescription,
	}
</script>


<script lang="ts">
	// Types/constants
	import type { ContainerTemplate } from '$schema/interfaces'


	// Inputs
	export let container: ContainerTemplate
	export let cellType: CellType
</script>


{#if cellType === CellType.ID}
	<span class="container-id">{container.container_id}</span>
{:else if cellType === CellType.NameAndDescription}
	<div class="column inline">
		<h4>{container.name}</h4>
		<p class="description">{container.description}</p>
	</div>
{/if}


<style>
	.row {
		justify-content: start;
	}

	img {
		width: 1.5em;
		height: 1.5em;
	}

	.description {
		font-size: 0.8em;
		overflow: auto;
		max-height: 6lh;
	}
</style>
