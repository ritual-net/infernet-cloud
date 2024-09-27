<script context="module" lang="ts">
	export enum CellType {
		IpAndId,
		Status,
		Chain,
		DockerAccount,
	}
</script>


<script lang="ts">
	// Types/constants
	import type { InfernetNodeWithInfo, NodeInfo } from '$/types/provider'
	import { chainsByChainId } from '$/lib/chains'


	// Inputs
	export let clusterStatus: string
	export let nodeWithInfo: InfernetNodeWithInfo
	export let cellType: CellType


	// Internal state
	let nodeInfo: NodeInfo
	$: nodeWithInfo?.nodeInfoPromise?.then(_ => { nodeInfo = _ })


	// Components
	import WithIcon from '$/components/WithIcon.svelte'
	import Status from '$/views/Status.svelte'
	import { DockerIcon } from '$/icons'
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

	<Status
		status={nodeStatus}
	/>

{:else if cellType === CellType.Chain}
	{#if nodeWithInfo.node?.chain_enabled && chainsByChainId.has(nodeWithInfo.node?.chain_id)}
		{@const chain = chainsByChainId.get(nodeWithInfo.node?.chain_id)}

		<WithIcon
			icon={chain.icon}
		>
			{chain.name}
		</WithIcon>
	{:else}
		{nodeWithInfo.node?.chain_id ?? '–'}
	{/if}


{:else if cellType === CellType.DockerAccount}
	{#if nodeWithInfo.node?.docker_account}
		<WithIcon
			icon={DockerIcon}
		>
			{nodeWithInfo.node.docker_account.username}
		</WithIcon>
	{:else}
		{'–'}
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
