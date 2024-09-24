<script context="module" lang="ts">
	export enum CellType {
		IpAndId,
		Status,
	}
</script>


<script lang="ts">
	// Types/constants
	import type { InfernetNodeWithInfo, NodeInfo } from '$/types/provider'


	// Inputs
	export let clusterStatus: string
	export let nodeWithInfo: InfernetNodeWithInfo
	export let cellType: CellType


	// Internal state
	let nodeInfo: NodeInfo
	$: nodeWithInfo?.nodeInfoPromise?.then(_ => { nodeInfo = _ })


	// Components
	import Status from '$/views/Status.svelte'
</script>


{#if cellType === CellType.IpAndId}
	{#if !nodeWithInfo.node && clusterStatus === 'healthy'}
		<div class="card error">
			<p>Error fetching node info.</p>
		</div>
	{:else}
		{@const nodeId = nodeWithInfo.node.state?.id ?? nodeWithInfo.node.provider_id ?? nodeWithInfo.node.id}

		<p>{nodeWithInfo.node?.state?.ip ?? nodeInfo?.ip ?? '–'}</p>  
		<p>
			<span class="node-id">{nodeId ?? '–'}</span>
		</p>
	{/if}


{:else if cellType === CellType.Status}
	{@const nodeStatus = (
		nodeWithInfo.node.state?.id ?
			nodeInfo?.status ?
				nodeInfo.status
			:
				undefined
		:
			'undeployed'
	)}

	{#if nodeStatus}
		<Status
			status={nodeStatus}
		/>
	{:else}
		<p class="card small loading">Loading...</p>
	{/if}
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
