<script lang="ts">
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
		info?.status
			? {
				'RUNNING': 'healthy',
				'TERMINATED': 'terminated',
			}[info.status] || info.status
			: 'unknown'
	)


	// Functions
	import { formatNumberCompact } from '$/lib/format'
	import { resolveRoute } from '$app/paths'


	// Actions
	import { applyAction, enhance } from '$app/forms'
	import { invalidate } from '$app/navigation'
	import { addToast, removeToast } from '$/components/Toaster.svelte'


	// Components
	import RitualLogo from '$/icons/RitualLogo.svelte'
	import DropdownMenu from '$/components/DropdownMenu.svelte'
	import NodeContainersTable from './NodeContainersTable.svelte'
	import Status from '$/views/Status.svelte'
</script>


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
					{node.id}
				</h2>

				<p>Infernet node</p>
				<!-- <p>Created {node.created}</p> -->
			</div>
		</div>

		<div class="row">
			<dl class="status-container card row">
				<dt>Status</dt>

				<dd>
					<Status
						status={nodeStatus}
					/>
				</dd>
			</dl>

			<!-- <form
				method="POST"
				action="/?start"
				use:enhance
			>
				<button type="submit">Start node</button>
			</form> -->

			<DropdownMenu
				labelText="Node Actions"
				items={[
					{
						value: 'refresh',
						label: 'Refresh data',
						onClick: async () => {
							const toast = addToast({
								data: {
									type: 'default',
									title: `Refreshing data...`,
								},
							})

							await invalidate(resolveRoute(`/api/node/[nodeId]`, { nodeId: $page.params.nodeId }))

							removeToast(toast.id)
						},
					},
					{
						value: 'start',
						label: 'Start node',
						formAction: `?/start`,
						formSubmit: async (e) => {
							const toast = addToast({
								data: {
									type: 'default',
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
					{
						value: 'stop',
						label: 'Stop node',
						formAction: `?/stop`,
						formSubmit: async (e) => {
							const toast = addToast({
								data: {
									type: 'default',
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
				]}
			/>
		</div>
	</header>

	<section class="column">
		<h3>Configuration</h3>

		<dl class="card column">
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

			{#if node.docker_account}
				<section class="row wrap">
					<dt>Docker Hub Account</dt>

					<dd>
						{node.docker_account.username}
					</dd>
				</section>
			{/if}
		</dl>
	</section>

	{#if node.chain_enabled}
		<section class="column">
			<h3>Onchain details</h3>

			<dl class="card column">
				{#if node.rpc_url}
					<section class="row wrap">
						<dt>RPC URL</dt>

						<dd>
							{node.rpc_url}
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

				{#if node.snapshot_sync_sleep || node.snapshot_sync_batch_size}
					<section class="row wrap">
						<dt>Snapshot syncing</dt>

						<dd>
							<p>{node.snapshot_sync_sleep} {({ 'one': 'second', 'other': 'seconds'})[new Intl.PluralRules('en-US').select(node.snapshot_sync_sleep)]} between snapshots</p>
							<p>{node.snapshot_sync_batch_size} {({ 'one': 'subscription', 'other': 'subscriptions'})[new Intl.PluralRules('en-US').select(node.snapshot_sync_batch_size)]} per batch</p>
						</dd>
					</section>
				{/if}
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

			<!-- {#if info?.ip}
				<section class="row wrap">
					<dt>IP</dt>

					<dd>
						{info.ip}
					</dd>
				</section>
			{/if} -->

			<!-- {#if infoError}
				<section class="column">
					<dt>Error</dt>

					<dd>
						<output>
							<pre><code>{infoError}</code></pre>
						</output>
					</dd>
				</section>
			{/if} -->
		</dl>
	</section>

	<div>
		<h3>Containers</h3>

		<NodeContainersTable
			containers={node.containers}
		/>
	</div>
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

		background-color: var(--color-ritualBlack);
		color: #fff;
	}

	header .status-container {
		--card-paddingX: 1.5em;
		--card-paddingY: 0.75em;
		--card-backgroundColor: rgba(0, 0, 0, 0.04);
		--card-borderColor: transparent;
		font-size: 0.9em;
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

	.secured:not(:active) {
		-webkit-text-security: disc;
	}
</style>
