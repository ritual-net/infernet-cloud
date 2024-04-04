<script context="module" lang="ts">
	export enum CellType {
		Status,
	}
</script>


<script lang="ts">
	// Types/constants
	import type { Container } from '$schema/interfaces'


	// Inputs
	export let container: Container
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
