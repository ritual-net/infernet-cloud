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
	import type { InfernetNodeWithInfo } from '$/types/provider'
	import { chainsByChainId } from '$/lib/chains'


	// Inputs
	export let clusterStatus: string
	export let nodeWithInfo: InfernetNodeWithInfo
	export let cellType: CellType


	// Components
	import WithIcon from '$/components/WithIcon.svelte'
	import Status from '$/views/Status.svelte'
	import { DockerIcon } from '$/icons';
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
			nodeWithInfo.node?.state?.id ?
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
