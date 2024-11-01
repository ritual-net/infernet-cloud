<script lang="ts">
	// Types/constants
	import { providers } from '$/types/provider'
	import { TFAction } from '$/types/terraform'


	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	$: ({
		cluster,
		nodesWithInfoPromise,
	} = $page.data as PageData)


	// Functions
	import { resolveRoute } from '$app/paths'

	const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
	})


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

	const invalidatePage = async () => {
		await Promise.all([
			invalidate(resolveRoute(`/api/cluster/[clusterId]`, { clusterId: $page.params.clusterId })),

			...cluster.nodes.map(node => (
				invalidate(resolveRoute(`/api/node/[nodeId]`, { nodeId: node.id }))
			))
		])
	}


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import DropdownMenu from '$/components/DropdownMenu.svelte'
	import NodesTable from './NodesTable.svelte'
	import RitualLogo from '$/icons/RitualLogo.svelte'
	import Status from '$/views/Status.svelte'
	import TerraformDeployment from './TerraformDeployment.svelte'
	import WithIcon from '$/components/WithIcon.svelte'


	// Transitions
	import { scale } from 'svelte/transition'
	import SizeTransition from '$/components/SizeTransition.svelte'
</script>


<svelte:head>
	<title>{cluster.name || cluster.id} | Cluster | Infernet Cloud</title>
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
					{cluster.name || cluster.id}
				</h2>

				<p>Infernet cluster</p>
				<!-- <p>Created {cluster.created}</p> -->
			</div>
		</div>

		<div class="row wrap">
			<dl class="status-container card row">
				<dt>Status</dt>

				<dd>
					<Status
						status={cluster.status}
					/>
				</dd>
			</dl>

			<a
				href={resolveRoute(`/clusters/[clusterId]/edit`, {
					clusterId: $page.params.clusterId,
				})}
				class="button primary"
			>Edit cluster</a>

			<DropdownMenu
				labelText="Cluster actions"
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

							await invalidate(resolveRoute(`/api/cluster/[clusterId]`, { clusterId: $page.params.clusterId }))

							removeToast(toast.id)
						},
					},
					{
						value: 'apply',
						label: (
							cluster.status !== 'destroyed'
								? 'Trigger update'
								: 'Recreate cluster'
						), 
						formAction: `?/apply`,
						formSubmit: async (e) => {
							const toast = addToast({
								closeDelay: 0,
								data: {
									type: 'loading',
									title: (
										cluster.status !== 'destroyed' ?
											`Applying changes to cluster "${cluster.name}"...`
										:
											`Recreating cluster "${cluster.name}"...`
									)
								},
							})

							setTimeout(() => {
								invalidatePage()
							}, 500)

							return async ({ result }) => {
								await applyAction(result)

								if(result.type === 'success')
									invalidatePage()

								removeToast(toast.id)
							}
						},
					},
					(
						cluster.status !== 'destroyed'
							? {
								value: 'destroy',
								label: 'Destroy cluster',
								isDestructive: true,
								formAction: `?/destroy`,
								formSubmit: async (e) => {
									const toast = addToast({
										closeDelay: 0,
										data: {
											type: 'loading',
											title: `Destroying cluster "${cluster.name}"...`,
										},
									})

									return async ({ result }) => {
										await applyAction(result)

										if(result.type === 'success')
											invalidatePage()

										removeToast(toast.id)
									}
								},
							}
							: {
								value: 'delete',
								label: 'Delete cluster',
								isDestructive: true,
								formAction: `?/delete`,
								formSubmit: async (e) => {
									const toast = addToast({
										closeDelay: 0,
										data: {
											type: 'loading',
											title: `Deleting cluster "${cluster.name}"...`,
										},
									})

									return async ({ result }) => {
										await applyAction(result)

										if(result.type === 'success')
											invalidatePage()

										removeToast(toast.id)
									}
								},
							}
					),
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
				Add node
			</a>
		</div>

		<NodesTable
			clusterStatus={cluster.status}
			{nodesWithInfoPromise}
		/>
	</section>

	{#if cluster.router || cluster.router_state?.ip}
		<section class="column">
			<h3>Router</h3>

			<dl class="card column">
				{#if cluster.router_state?.ip}
					<section class="row wrap">
						<dt>IP</dt>

						<dd>
							{cluster.router_state.ip}
						</dd>
					</section>
				{/if}

				{#if cluster.router}
					<section class="row wrap">
						<dt>Region / Zone</dt>

						<dd>
							<WithIcon
								icon={providers[cluster.service_account.provider].icon}
							>
								{cluster.router.region} / {cluster.router.zone}
							</WithIcon>
						</dd>
					</section>

					<section class="row wrap">
						<dt>Machine type</dt>

						<dd>
							<WithIcon
								icon={providers[cluster.service_account.provider].icon}
							>
								{cluster.router.machine_type}
							</WithIcon>
						</dd>
					</section>

					<section class="row wrap">
						<dt>Machine image</dt>

						<dd>
							<WithIcon
								icon={providers[cluster.service_account.provider].icon}
							>
								{cluster.router.machine_image}
							</WithIcon>
						</dd>
					</section>
				{/if}
			</dl>
		</section>
	{/if}

	<section class="column">
		<h3>Configuration</h3>

		<dl class="card column">
			<section class="row wrap">
				<dt>Cloud account</dt>

				<dd>
					<a
						href={resolveRoute(`/cloud-accounts/[serviceAccountId]`, {
							serviceAccountId: cluster.service_account.id,
						})}
					>
						<WithIcon
							icon={providers[cluster.service_account.provider].icon}
						>
							{cluster.service_account.name}
						</WithIcon>
					</a>
				</dd>
			</section>

			<section class="row wrap">
				<dt>Default region / zone</dt>

				<dd>
					<WithIcon
						icon={providers[cluster.service_account.provider].icon}
					>
						{#if 'region' in cluster}
							{cluster.region}
						{/if}

						{#if 'region' in cluster && 'zone' in cluster}
							/
						{/if}

						{#if 'zone' in cluster}
							{cluster.zone}
						{/if}
					</WithIcon>
				</dd>
			</section>

			<section class="row wrap">
				<dt>IPs allowed (HTTP)</dt>

				{#if cluster.ip_allow_http}
					<dd class="column inline">
						{#each cluster.ip_allow_http as ip}
							<p>{ip}</p>
						{:else}
							None
						{/each}
					</dd>
				{:else}
					<dd>All</dd>
				{/if}
			</section>

			<section class="row wrap">
				<dt>IPs allowed (SSH)</dt>

				{#if cluster.ip_allow_ssh}
					<dd class="column inline">
						{#each cluster.ip_allow_ssh as ip}
							<p>{ip}</p>
						{:else}
							None
						{/each}
					</dd>
				{:else}
					<dd>All</dd>
				{/if}
			</section>

			<section class="row wrap">
				<dt>Has router?</dt>

				<dd>
					{cluster.router ? 'Yes' : 'No'}
				</dd>
			</section>
		</dl>
	</section>

	<section class="column">
		<h3>Deployment</h3>

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
				{#if cluster.latest_deployment.timestamp}
					<section class="row wrap">
						<dt>Last updated</dt>

						<dd>
							<date>{dateTimeFormat.format(new Date(cluster.latest_deployment.timestamp))}</date>
						</dd>
					</section>
				{/if}

				<TerraformDeployment
					clusterName={cluster.name}
					provider={cluster.service_account.provider}
					deployment={cluster.latest_deployment}
					isSummary
				/>
			{/if}
		</dl>
	</section>

	<section class="column">
		<h3 class="row inline">
			History
			<span class="annotation">
				{cluster.deployments.length}
			</span>
		</h3>

		<div class="history column">
			{#each (
				// Group by "init" actions
				cluster.deployments
					.toReversed()
					.reduce((groups, snapshot, i) => {
						if(snapshot.action === TFAction.Init || i === 0)
							groups.push([snapshot])
						else
							groups[groups.length - 1].push(snapshot)
						return groups
					}, [])
					.toReversed()
			) as group (group[0]?.id)}
				<div class="history-group-container column">
					<h4 class="annotation">
						{#if group[0] && group.at(-1)}
							{dateTimeFormat.formatRange(new Date(group[0].timestamp), new Date(group.at(-1).timestamp))}
						{:else if group[0]}
							{dateTimeFormat.format(new Date(group[0].timestamp))}
						{/if}
					</h4>

					<div class="column card">
						{#each group as snapshot (snapshot.id)}
							<Collapsible
								class="card"
							>
								<svelte:fragment slot="trigger">
									<header class="row wrap">
										<h4>{snapshot.action}</h4>

										<div class="column inline">
											<dd>
												<Status
													status={snapshot.status}
												/>
											</dd>

											<span class="annotation">at {new Date(snapshot.timestamp).toLocaleString()}</span>
										</div>
									</header>
								</svelte:fragment>

								<dl class="snapshot-details column">
									<section class="row wrap">
										<dt>Status</dt>

										<dd>
											<Status
												status={snapshot.status}
											/>
										</dd>
									</section>

									<section class="row wrap">
										<dt>Timestamp</dt>

										<dd>
											{dateTimeFormat.format(new Date(snapshot.timestamp))}
										</dd>
									</section>

									<TerraformDeployment
										clusterName={cluster.name}
										provider={cluster.service_account.provider}
										deployment={snapshot}
									/>
								</dl>
							</Collapsible>
						{:else}
							<div class="card">
								<p>No deployments found.</p>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<div class="card">
					<p>No deployments found.</p>
				</div>
			{/each}
		</div>
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

	header.row > :last-child {
		text-align: end;
	}

	header .status-container {
		--card-paddingX: 1.5em;
		--card-paddingY: 0.75em;
		--card-backgroundColor: light-dark(rgba(0, 0, 0, 0.04), rgba(255, 255, 255, 0.04));
		--card-borderColor: transparent;
		font-size: 0.9em;
	}

	.snapshot-details {
		background-color: rgba(0, 0, 0, 0.03);
	}

	output {
		font-size: 0.75em;
	}

	code {
		white-space: pre-wrap;
		word-break: break-word;
		tab-size: 2;
	}

	.history {
		gap: 1.25em;

		.history-group-container {
			gap: 0.75em;
		}
	}
</style>
