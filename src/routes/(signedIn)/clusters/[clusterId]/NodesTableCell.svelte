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
	{@const nodeStatus = nodeInfo?.status ?? 'unknown'}

	<div class="row">
		<div
			class="status"
			data-status={nodeStatus}
		>{{
			'unknown': 'Unknown',
			'healthy': 'Healthy',
			'updating': 'Updating',
			'unhealthy': 'Unhealthy',
		}[nodeStatus]}</div>
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

	.status {
		&[data-status="healthy"] {
			--status-color: #16B371;
		}

		&[data-status="updating"] {
			--status-color: #b3a316;
		}

		&[data-status="unhealthy"] {
			--status-color: #b33d16;
		}

		&[data-status="unknown"] {
			--status-color: gray;
		}

		&:before {
			content: '⏺';
			margin-right: 0.33em;
			color: var(--status-color);
		}
	}
</style>
