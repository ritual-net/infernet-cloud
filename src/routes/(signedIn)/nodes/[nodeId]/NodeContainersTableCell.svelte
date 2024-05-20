<script context="module" lang="ts">
	export enum CellType {
		ID,
		Description,
	}
</script>


<script lang="ts">
	// Types/constants
	import type { Container } from '$schema/interfaces'


	// Inputs
	export let container: Container
	export let cellType: CellType
</script>


{#if cellType === CellType.ID}
	<span class="container-id">{container.container_id}</span>

{:else if cellType === CellType.Description}
	<p class="description">
		{container.description}
	</p>
{/if}


<style>
	.container-id {
		font-size: 0.8em;
	}

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
