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
	export let clusterStatus: string
	export let nodeWithInfo: InfernetNodeWithInfo
	export let cellType: CellType


	// Components
	import Status from '$/views/Status.svelte'
</script>


{#if cellType === CellType.IpAndId}
	{#if !nodeWithInfo.node && clusterStatus === 'healthy'}
		<div class="card error">
			<p>Error fetching node info.</p>
		</div>
	{:else}
		<p>{nodeWithInfo.node?.state?.ip ?? nodeWithInfo?.info?.ip ?? '–'}</p>  
		<p><span class="node-id">{nodeWithInfo.node?.state?.id ?? nodeWithInfo.node?.provider_id ?? '–'}</span></p>
	{/if}


{:else if cellType === CellType.Status}
	{@const nodeStatus = (
		nodeWithInfo.node ?
			nodeWithInfo.node.state?.id ?
				nodeWithInfo.info?.status ?
					nodeWithInfo.info.status
				:
					'unknown'
			:
				'undeployed'
		:
			'unknown'
	)}

	<div class="row">
		<Status
			status={nodeStatus}
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
