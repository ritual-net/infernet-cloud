<script context="module" lang="ts">
	export enum CellType {
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


{#if cellType === CellType.Description}
	<div class="column inline">
		<p>{container.image}</p>

		<p class="description">
			{container.description}
		</p>
	</div>
{/if}


<style>
	.description {
		font-size: 0.8em;
		overflow: auto;
		max-height: 6lh;
	}
</style>
