<script lang="ts">
	// Types/constants
	import { providers } from '$/types/provider'


	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	$: ({
		cluster,
		nodesWithInfoPromise,
	} = $page.data as PageData)


	// Internal state
	let nodesWithInfo: Awaited<typeof nodesWithInfoPromise> | undefined
	$: nodesWithInfoPromise.then(_ => nodesWithInfo = _)


	// Functions
	import { resolveRoute } from '$app/paths'


	// Actions
	import { addToast, removeToast } from '$/components/Toaster.svelte'
	import { applyAction } from '$app/forms'
	import { invalidate } from '$app/navigation'

	import { onMount } from 'svelte'

	onMount(() => {
		let isMounted = true

		;(async () => {
			while(isMounted) {
				await new Promise(resolve => setTimeout(resolve, 5000))
				if(!isMounted) return

				await invalidate(
					resolveRoute('/api/cluster/[clusterId]', {
						clusterId: $page.params.clusterId
					})
				)
			}
		})()

		return () => {
			isMounted = false
		}
	})


	// Components
	import DropdownMenu from '$/components/DropdownMenu.svelte'
	import NodesTable from './NodesTable.svelte'
	import RitualLogo from '$/icons/RitualLogo.svelte'
	import Status from '$/views/Status.svelte'


	// Transitions
	import { scale } from 'svelte/transition'
	import SizeTransition from '$/components/SizeTransition.svelte'
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
					{cluster.name || cluster.id}
				</h2>

				<p>Infernet Cluster</p>
				<!-- <p>Created {cluster.created}</p> -->
			</div>
		</div>

		<div class="row">
			<dl class="card inline">
				<div class="row">
					<dt>Status</dt>
					<dd>
						<Status
							status={cluster.status}
						/>
					</dd>
				</div>
			</dl>

			<a
				href={resolveRoute(`/clusters/[clusterId]/edit`, {
					clusterId: $page.params.clusterId,
				})}
				class="button primary"
			>Edit Cluster</a>

			<DropdownMenu
				labelText="Cluster Actions"
				items={[
					{
						value: 'refresh',
						label: 'Refresh Data',
						onClick: async () => {
							const toast = addToast({
								data: {
									type: 'default',
									title: `Refreshing data...`,
								},
							})

							await invalidate(resolveRoute(`/api/cluster/[clusterId]`, { clusterId: $page.params.clusterId }))

							removeToast(toast.id)
						},
					},
					{
						value: 'apply',
						label: 'Trigger Update',
						formAction: `?/apply`,
						formSubmit: async (e) => {
							const toast = addToast({
								data: {
									type: 'default',
									title: `Applying changes to cluster "${cluster.name}"...`,
								},
							})

							setTimeout(() => {
								invalidate(resolveRoute(`/api/cluster/[clusterId]`, { clusterId: $page.params.clusterId }))
							}, 500)

							return async ({ result }) => {
								await applyAction(result)

								if(result.type === 'success')
									invalidate(resolveRoute(`/api/cluster/[clusterId]`, { clusterId: $page.params.clusterId }))

								removeToast(toast.id)
							}
						},
					},
					{
						value: 'delete',
						label: 'Delete Cluster',
						formAction: `?/delete`,
						formSubmit: async (e) => {
							const toast = addToast({
								data: {
									type: 'default',
									title: `Deleting cluster "${cluster.name}"...`,
								},
							})

							return async ({ result }) => {
								await applyAction(result)

								removeToast(toast.id)
							}
						},
					},
				]}
			/>
		</div>
	</header>

	<section class="column">
		<div class="row">
			<h3>Nodes</h3>

			<a
				href={resolveRoute(`/clusters/[clusterId]/add-node`, {
					clusterId: $page.params.clusterId,
				})}
				class="button"
			>
				Add Node
			</a>
		</div>

		<SizeTransition>
			<div class="stack">
				{#if !nodesWithInfo}
					<div class="card" transition:scale>
						<p>Loading nodes...</p>
					</div>
				{:else}
					<NodesTable
						{nodesWithInfo}
					/>
				{/if}
			</div>
		</SizeTransition>
	</section>

	<section class="column">
		<h3>Details</h3>

		<dl class="card column">
			<section class="row wrap">
				<dt>Cloud Account</dt>

				<dd>
					<a
						href={resolveRoute(`/cloud-accounts/[serviceAccountId]`, {
							serviceAccountId: cluster.service_account.id,
						})}
						class="row inline with-icon"
					>
						<img
							class="icon"
							src={providers[cluster.service_account.provider].icon}
						/>
						{cluster.service_account.name}
					</a>
				</dd>
			</section>

			<section class="row wrap">
				<dt>Region / Zone</dt>

				<dd>
					{#if 'region' in cluster}
						{cluster.region}
					{/if}

					{#if 'region' in cluster && 'zone' in cluster}
						/
					{/if}

					{#if 'zone' in cluster}
						{cluster.zone}
					{/if}
				</dd>
			</section>

			<section class="row wrap">
				<dt>Machine Type</dt>

				<dd>
					{cluster.machine_type}
				</dd>
			</section>

			<section class="row wrap">
				<dt>IPs Allowed (HTTP)</dt>

				{#if cluster.ip_allow_http?.length}
					<dd class="column inline">
						{#each cluster.ip_allow_http as ip}
							<p>{ip}</p>
						{/each}
					</dd>
				{:else}
					<dd>All</dd>
				{/if}
			</section>

			<section class="row wrap">
				<dt>IPs Allowed (SSH)</dt>

				{#if cluster.ip_allow_ssh?.length}
					<dd class="column inline">
						{#each cluster.ip_allow_ssh as ip}
							<p>{ip}</p>
						{/each}
					</dd>
				{:else}
					<dd>All</dd>
				{/if}
			</section>

			<section class="row wrap">
				<dt>Has Deployed Router?</dt>

				<dd>
					{cluster.deploy_router ? 'Yes' : 'No'}
				</dd>
			</section>

			{#if cluster.router?.ip}
				<section class="row wrap">
					<dt>Router IP</dt>

					<dd>
						{cluster.router.ip}
					</dd>
				</section>
			{/if}
		</dl>
	</section>

	<section class="column">
		<h3>Status</h3>

		<dl class="card column">
			<section class="row wrap">
				<dt>Status</dt>

				<dd>
					<Status
						status={cluster.status}
					/>
				</dd>
			</section>

			{#if cluster.latest_deployment}
				{#if cluster.latest_deployment.error}
					<section class="column">
						<dt>Error</dt>
		
						<dd class="scrollable">
							<output><code>{cluster.latest_deployment.error}</code></output>
						</dd>
					</section>
				{/if}

				{#if cluster.latest_deployment.tfstate}
					<section class="column">
						<dt>Terraform State</dt>
		
						<dd class="scrollable">
							<output><code>{JSON.stringify(cluster.latest_deployment.tfstate, null, '\t')}</code></output>
						</dd>
					</section>
				{/if}

				{#if cluster.latest_deployment.stdout?.length}
					<section class="column">
						<dt>Terraform Logs</dt>
		
						<dd class="scrollable log-container">
							{#each cluster.latest_deployment.stdout as log, i}
								{@const previousLog = cluster.latest_deployment.stdout[i - 1]}

								{#if previousLog && previousLog['@type'] !== log['@type']}
									<hr>
								{/if}

								<output
									class="log"
									data-type={log['type']} 
									data-level={log['@level']}
									data-module={log['@module']}
								><date date={log['@timestamp']}>{new Date(log['@timestamp']).toLocaleString()}</date> <code>{log['@message']}</code></output>
							{/each}
						</dd>
					</section>
				{/if}

				{#if cluster.latest_deployment.stderr?.length}
					<section class="column">
						<dt>Terraform Error Logs</dt>
		
						<dd class="scrollable log-container">
							{#each cluster.latest_deployment.stderr as log, i}
								{@const previousLog = cluster.latest_deployment.stderr[i - 1]}

								{#if previousLog && previousLog['@type'] !== log['@type']}
									<hr>
								{/if}

								<output
									class="log"
									data-type={log['type']} 
									data-level={log['@level']}
									data-module={log['@module']}
								><date date={log['@timestamp']}>{new Date(log['@timestamp']).toLocaleString()}</date> <code>{log['@message']}</code></output>
							{/each}
						</dd>
					</section>
				{/if}
			{/if}
		</dl>
	</section>
</div>


<style>
	.container {
		gap: 2rem;
		margin-bottom: 20dvh;
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

	.scrollable {
		overflow: auto;
		max-height: 19.6rem;
		resize: all;
		padding: 0.66em 1em;

		background: rgba(0, 0, 0, 0.05);
		border-radius: 0.5em;
	}

	output {
		font-size: 0.75em;
	}

	code {
		white-space: pre-wrap;
		word-break: break-word;
		tab-size: 2;
	}

	.log-container {
		display: grid;

		.log {
			margin-inline: -1rem;
			padding-inline: 1rem;
			padding-block: 0.1rem;

			&[data-level="error"] {
				background-color: rgb(255, 246, 246);
				color: rgb(150, 0, 0);
			}
		}

		date {
			position: sticky;
			right: 0;
			float: right;
			font-size: smaller;
			opacity: 0.5;
		}

		code {
			white-space: pre-line;
		}
	}
</style>
