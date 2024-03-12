<script context="module" lang="ts">
	export enum CellType {
		Status,
	}
</script>


<script lang="ts">
	// Types/constants
	import type { InfernetNode } from '$schema/interfaces'


	// Inputs
	export let node: InfernetNode
	export let cellType: CellType
</script>


{#if cellType === CellType.Status}
	<div class="row">
		<!-- {} -->
	</div>
{:else}

{/if}


<style>
	.row {
		justify-content: start;
	}

	img {
		width: 1.5em;
		height: 1.5em;
	}
</style>
