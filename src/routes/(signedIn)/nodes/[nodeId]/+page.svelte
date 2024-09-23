<script lang="ts">
	// Types/constants
	import type { BaseNodeClient } from '$/lib/clients/node/base'
	import { providers, ProviderTypeEnum } from '$/types/provider'
	import { chainsByChainId } from '$/lib/chains'


	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	$: ({
		node,
		info,
		infoError,
	} = $page.data as PageData)


	// Internal state
	// (Computed)
	$: nodeStatus = (
		node ?
			node.state?.id ?
				info?.status ?
					info.status
				:
					'unknown'
			:
				'undeployed'
		:
			'unknown'
	)

	// (Output)
	$: logsQuery = createInfiniteQuery({
		queryKey: ['nodeLogs', {
			nodeId: node?.id,
		}] as const,

		initialPageParam: 0,

		queryFn: async ({
			queryKey: [_, {
				nodeId,
			}],
			pageParam: start,
		}) => (
			await fetch(
				`${resolveRoute('/api/node/[nodeId]/logs', {
					nodeId,
				})}?${new URLSearchParams({
					start: start?.toString(),
				})}`,
			)
				.then(async response => {
					if(!response.ok)
						throw await response.text()

					return await response.json() as ReturnType<BaseNodeClient['getLogs']>
				})
		),

		getNextPageParam: (lastPage) => lastPage.next,

		select: result => (
			result
				.pages
				.flatMap(page => page.logs)
		),
	})


	// Functions
	import { createInfiniteQuery } from '@tanstack/svelte-query'
	import { formatNumberCompact } from '$/lib/format'
	import { resolveRoute } from '$app/paths'
	import { isTruthy } from '$/lib/utils/isTruthy'


	// Actions
	import { applyAction, enhance } from '$app/forms'
	import { invalidate } from '$app/navigation'
	import { addToast, removeToast } from '$/components/Toaster.svelte'


	// Components
	import RitualLogo from '$/icons/RitualLogo.svelte'
	import Collapsible from '$/components/Collapsible.svelte'
	import DetailsValue from '$/components/DetailsValue.svelte'
	import DropdownMenu from '$/components/DropdownMenu.svelte'
	import NodeContainersTable from './NodeContainersTable.svelte'
	import ScrollArea from '$/components/ScrollArea.svelte'
	import Status from '$/views/Status.svelte'
	import WithIcon from '$/components/WithIcon.svelte'
	import { DockerIcon } from '$/icons'
</script>


<svelte:head>
	<title>Node {node?.state?.id ?? node?.id ?? 'Node'} | Infernet Cloud</title>
</svelte:head>


<div class="container column">
	<header class="row wrap">
		<div class="row">
			<div
				class="icon"
			>
				<RitualLogo />
			</div>

			<div class="column inline">
				<h2>
					{node?.state?.id ?? node?.id}
				</h2>

				<p>Infernet node</p>
				<!-- <p>Created {node.created}</p> -->
			</div>
		</div>

		<div class="row wrap">
			<dl class="status-container card row">
				<dt>Status</dt>

				<dd>
					<Status
						status={nodeStatus}
					/>
				</dd>
			</dl>

			<a
				href={resolveRoute(`/nodes/[nodeId]/edit`, {
					nodeId: $page.params.nodeId,
				})}
				class="button primary"
			>Edit node</a>

			<DropdownMenu
				labelText="Node Actions"
				items={[
					{
						value: 'refresh',
						label: 'Refresh data',
						onClick: async () => {
							const toast = addToast({
								closeDelay: 0,
								data: {
									type: 'loading',
									title: `Refreshing data...`,
								},
							})

							await invalidate(resolveRoute(`/api/node/[nodeId]`, { nodeId: $page.params.nodeId }))

							removeToast(toast.id)
						},
					},
					['stopped', 'terminated'].includes(info?.status) && {
						value: 'start',
						label: 'Start node',
						formAction: `?/start`,
						formSubmit: async (e) => {
							const toast = addToast({
								closeDelay: 0,
								data: {
									type: 'loading',
									title: 'Starting node...',
								},
							})

							setTimeout(() => {
								invalidate(resolveRoute(`/api/node/[nodeId]`, { nodeId: $page.params.nodeId }))
							}, 500)
		
							return async ({ result }) => {
								await applyAction(result)
		
								if(result.type === 'success')
									invalidate(resolveRoute(`/api/node/[nodeId]`, { nodeId: $page.params.nodeId }))
		
								removeToast(toast.id)
							}
						},
					},
					['running'].includes(info?.status) && {
						value: 'stop',
						label: 'Stop node',
						formAction: `?/stop`,
						formSubmit: async (e) => {
							const toast = addToast({
								closeDelay: 0,
								data: {
									type: 'loading',
									title: 'Stopping node...',
								},
							})

							setTimeout(() => {
								invalidate(resolveRoute(`/api/node/[nodeId]`, { nodeId: $page.params.nodeId }))
							}, 500)
		
							return async ({ result }) => {
								await applyAction(result)
		
								if(result.type === 'success')
									invalidate(resolveRoute(`/api/node/[nodeId]`, { nodeId: $page.params.nodeId }))
		
								removeToast(toast.id)
							}
						},
					},
				].filter(isTruthy)}
			/>
		</div>
	</header>

	<section class="column">
		<h3>Configuration</h3>

		<dl class="card column">
			<section class="row wrap">
				<dt>Region / Zone</dt>

				<dd>
					<WithIcon
						icon={node.provider && providers[node.provider].icon}
					>
						{#if 'region' in node}
							{node.region}
						{/if}

						{#if 'region' in node && 'zone' in node}
							/
						{/if}

						{#if 'zone' in node}
							{node.zone}
						{/if}
					</WithIcon>
				</dd>
			</section>

			<section class="row wrap">
				<dt>Machine type</dt>

				<dd>
					<WithIcon
						icon={node.provider && providers[node.provider].icon}
					>
						{node.machine_type}
					</WithIcon>
				</dd>
			</section>

			<section class="row wrap">
				<dt>Machine image</dt>

				<dd>
					<WithIcon
						icon={node.provider && providers[node.provider].icon}
					>
						{node.machine_image}
					</WithIcon>
				</dd>
			</section>

			{#if node.docker_account}
				<section class="row wrap">
					<dt>Docker Hub account</dt>

					<dd>
						<WithIcon
							icon={DockerIcon}
						>
							{node.docker_account.username}
						</WithIcon>
					</dd>
				</section>
			{/if}

			<section class="row wrap">
				<dt>Forward stats?</dt>

				<dd>
					{node.forward_stats ? 'Yes' : 'No'}
				</dd>
			</section>

			<section class="row wrap">
				<dt>Chain enabled?</dt>

				<dd>
					{node.chain_enabled ? 'Yes' : 'No'}
				</dd>
			</section>
		</dl>
	</section>

	{#if node.chain_enabled}
		<section class="column">
			<h3>Onchain configuration</h3>

			<dl class="card column">
				{#if node.rpc_url}
					<section class="row wrap">
						<dt>RPC URL</dt>

						<dd>
							{node.rpc_url}
						</dd>
					</section>
				{/if}

				{#if node.chain_id}
					<section class="row wrap">
						<dt>Chain</dt>

						<dd>
							{#if chainsByChainId[node.chain_id]}
								<WithIcon
									icon={chainsByChainId[node.chain_id].icon}
								>
									{chainsByChainId[node.chain_id].name}
								</WithIcon>
							{:else}
								{node.chain_id}
							{/if}
						</dd>
					</section>
				{/if}

				{#if node.registry_address}
					<section class="row wrap">
						<dt>Registry address</dt>

						<dd>
							{node.registry_address}
						</dd>
					</section>
				{/if}

				{#if node.trail_head_blocks}
					<section class="row wrap">
						<dt>Trail head blocks</dt>

						<dd>
							{node.trail_head_blocks}
						</dd>
					</section>
				{/if}

				{#if node.max_gas_limit !== undefined && node.max_gas_limit !== null}
					<section class="row wrap">
						<dt>Max gas limit</dt>

						<dd>
							{formatNumberCompact(node.max_gas_limit)}
						</dd>
					</section>
				{/if}

				{#if node.private_key}
					<section class="row wrap">
						<dt>Private key</dt>

						<dd>
							<span class="secured">{node.private_key}</span>
						</dd>
					</section>
				{/if}

				<section class="row wrap">
					<dt>Snapshot syncing</dt>

					<dd>
						<p>{(node.snapshot_sync_sleep ?? 1.0).toFixed(1)} {({ 'one': 'second', 'other': 'seconds'})[new Intl.PluralRules('en-US').select(node.snapshot_sync_sleep ?? 1.0)]} between snapshots</p>
						<p>{node.snapshot_sync_batch_size ?? 200} {({ 'one': 'subscription', 'other': 'subscriptions'})[new Intl.PluralRules('en-US').select(node.snapshot_sync_batch_size ?? 200)]} per batch</p>
					</dd>
				</section>
			</dl>
		</section>
	{/if}

	<section class="column">
		<h3>Status</h3>

		<dl class="card column">
			<section class="row wrap">
				<dt>Status</dt>

				<dd>
					<Status
						status={nodeStatus}
					/>
				</dd>
			</section>

			{#if node.state?.ip}
				<section class="row wrap">
					<dt>IP</dt>

					<dd>
						{node.state.ip}
					</dd>
				</section>
			{/if}

			{#if info?.instanceInfo || infoError}
				<section class="column">
					<dt>Instance info</dt>

					<dd>
						<Collapsible
							class="card"
						>
							<svelte:fragment slot="trigger">
								<header class="row" data-after="▾">
									<WithIcon
										icon={node.provider && providers[node.provider].icon}
									>
										{node?.state?.id ?? 'Instance'}
									</WithIcon>
								</header>
							</svelte:fragment>

							{#if info?.instanceInfo}
								<DetailsValue
									value={info?.instanceInfo}
								/>
							{/if}

							{#if infoError}
								<div class="card column error">
									<output>
								<pre><code>{infoError}</code></pre>
									</output>
								</div>
							{/if}
						</Collapsible>
					</dd>
				</section>
			{/if}
		</dl>
	</section>

	<section class="column">
		<header class="row wrap">
			<h3>Logs</h3>

			<div class="row wrap">
				<button
					class="small"
					on:click={() => {
						$logsQuery.refetch()
					}}
				>
					Refresh
				</button>

				<button
					class="small"
					on:click={() => {
						$logsQuery.fetchNextPage()
					}}
				>
					Load more
				</button>
			</div>
		</header>

		<dl class="card column">
			<section class="row">
				<dt>Last updated</dt>

				<dd>
					{$logsQuery.dataUpdatedAt ? new Date($logsQuery.dataUpdatedAt).toLocaleString() : '–'}
				</dd>
			</section>

			<section class="column">
				<dt>{node.provider === ProviderTypeEnum.GCP ? 'Serial Port 1' : 'Logs'}</dt>

				<dd>{$logsQuery.isError}
					{#if $logsQuery.isLoading}
						<div class="card loading">
							<p>Loading logs...</p>
						</div>
					{:else if $logsQuery.isError}
						<div class="card error">
							<p>Error loading logs: {$logsQuery.error.message}</p>
						</div>
					{:else if $logsQuery.data}
						{@const logs = $logsQuery.data}

						<ScrollArea>
							<div class="log-container">
								{#each logs as log, i}
									{@const previousLog = logs[i - 1]}

									{#if previousLog && previousLog.source !== log.source}
										<hr>
									{/if}

									<div
										class="log"
										data-source={log.source}
									>
										<output><date date={log.timestamp}>{new Date(log.timestamp).toLocaleString()}</date> {#if log.source}<span>{log.source}</span>{/if}<code>{log.text}</code></output>
									</div>
								{/each}
							</div>
						</ScrollArea>
					{:else}
						<p>No logs available.</p>
					{/if}
				</dd>
			</section>
		</dl>
	</section>

	<section>
		<h3>Containers</h3>

		<NodeContainersTable
			containers={node.containers}
		/>
	</section>
</div>


<style>
	.container {
		gap: 2rem;
	}

	.icon {
		width: 1.5em;
		height: 1.5em;
	}

	header .icon {
		flex-shrink: 0;
		width: 4em;
		height: 4em;
		border-radius: 0.25em;
		padding: 0.5em;

		background-color: light-dark(#000, #fff);
		color: light-dark(#fff, #000);
	}

	header .status-container {
		--card-paddingX: 1.5em;
		--card-paddingY: 0.75em;
		--card-backgroundColor: light-dark(rgba(0, 0, 0, 0.04), rgba(255, 255, 255, 0.04));
		--card-borderColor: transparent;
		font-size: 0.9em;
	}

	header h2 {
		font-size: 1.25em;
	}

	output {
		font-size: 0.75em;

		& pre {
			max-height: 15.6rem;
			padding: 1em;

			background: rgba(0, 0, 0, 0.05);
			border-radius: 0.5em;

			& code {
				white-space: pre-wrap;
				word-break: break-word;
			}
		}
	}

	.log-container {
		display: grid;
		align-items: center;

		padding: 0.66em 1em;
		background: rgba(0, 0, 0, 0.05);
		border-radius: 0.5em;

		.log {
			margin-inline: -1rem;
			padding-inline: 1rem;
			padding-block: 0.1rem;
		}

		date {
			position: sticky;
			top: 0.25em;
			right: 0;
			float: right;
			margin-left: 1em;
			line-height: 2.4;
			font-size: smaller;
			opacity: 0.5;
		}
	}

	.secured:not(:active) {
		-webkit-text-security: disc;
	}
</style>
