<script context="module" lang="ts">
	export enum CellType {
		IpAndId,
		Status,
	}
</script>


<script lang="ts">
	// Types/constants
	import type { InfernetNodeWithInfo } from '$/types/provider'


	// Inputs
	export let nodeWithInfo: InfernetNodeWithInfo
	export let cellType: CellType


	// Components
	import Status from '$/views/Status.svelte'
</script>


{#if cellType === CellType.IpAndId}
	<p>{nodeWithInfo?.info?.ip ?? '–'}</p>  
	<p><span class="node-id">{nodeWithInfo.node.provider_id ?? '–'}</span></p>

{:else if cellType === CellType.Status}
	<div class="row">
		<Status
			status={
				nodeWithInfo.info?.status
					? {
						'RUNNING': 'healthy',
						'TERMINATED': 'terminated',
					}[nodeWithInfo.info.status] || nodeWithInfo.info.status
					: 'unknown'
			}
		/>
	</div>
{/if}


<style>
	.node-id {
		font-size: 0.8em;
	}

	.row {
		justify-content: start;
	}

	img {
		width: 1.5em;
		height: 1.5em;
	}
</style>
