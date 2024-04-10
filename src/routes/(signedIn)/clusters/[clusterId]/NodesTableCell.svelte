<script context="module" lang="ts">
	export enum CellType {
		Status,
	}
</script>


<script lang="ts">
	// Types/constants
	import type { InfernetNode } from '$schema/interfaces'
	import type { NodeInfo } from '$/types/provider'


	// Inputs
	export let node: InfernetNode
	export let nodeInfo: NodeInfo | undefined
	export let cellType: CellType
</script>


{#if cellType === CellType.Status}
	{@const nodeStatus = nodeInfo?.status ?? 'Unknown'}

	<div class="row">
		{nodeStatus}

		<!-- <div
			class="status"
			data-status={nodeStatus}
		>
			{{
				'healthy': 'Healthy',
				'updating': 'Updating',
				'unhealthy': 'Unhealthy',
			}[nodeStatus]}
		</div> -->
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
