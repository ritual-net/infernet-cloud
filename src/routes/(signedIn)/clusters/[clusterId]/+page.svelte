<script lang="ts">
	// Types/constants
	import { providers } from '$/types/provider'


	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	$: ({
		cluster,
		nodesWithInfo,
	} = $page.data as PageData)


	// Internal state
	$: clusterStatus = cluster.locked ? 'updating' : cluster.healthy ? 'healthy' : 'unhealthy'


	// Functions
	import { resolveRoute } from '$app/paths'


	// Actions
	import { addToast, removeToast } from '$/components/Toaster.svelte'
	import { applyAction } from '$app/forms'
	import { invalidate } from '$app/navigation'


	// Components
	import DropdownMenu from '$/components/DropdownMenu.svelte'
	import NodesTable from './NodesTable.svelte'
	import RitualLogo from '$/icons/RitualLogo.svelte'
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
						<div
							class="status"
							data-status={clusterStatus}
						>
							{{
								'healthy': 'Healthy',
								'updating': 'Updating',
								'unhealthy': 'Unhealthy',
							}[clusterStatus]}
						</div>
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
						value: 'apply',
						label: 'Apply Changes',
						formAction: `?/apply`,
						formSubmit: async (e) => {
							const toast = addToast({
								data: {
									type: 'default',
									title: 'Applying changes to cluster...',
								},
							})

							return async ({ result }) => {
								await applyAction(result)

								if(result.type === 'success')
									await invalidate('.')

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
									title: 'Deleting cluster...',
								},
							})

							return async ({ result }) => {
								await applyAction(result)

								if(result.type === 'success')
									await invalidate('.')

								removeToast(toast.id)
							}
						},
					},
				]}
			/>
		</div>
	</header>

	<section class="column">
		<h3>Details</h3>

		<dl class="card column">
			<section class="row">
				<dt>Service Account</dt>

				<dd>
					<a
						href={resolveRoute(`/service-accounts/[serviceAccountId]`, {
							serviceAccountId: cluster.service_account.id,
						})}
						class="row"
					>
						<img
							class="icon"
							src={providers[cluster.service_account.provider].icon}
						/>
						{cluster.service_account.name}
					</a>
				</dd>
			</section>

			<section class="row">
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

			<section class="row">
				<dt>Machine Type</dt>

				<dd>
					{cluster.machine_type}
				</dd>
			</section>

			<section class="row">
				<dt>IPs Allowed (HTTP)</dt>

				{#if cluster.ip_allow_http?.length}
					<dd class="column inline">
						{#each cluster.ip_allow_http as ip}
							{ip}
						{/each}
					</dd>
				{:else}
					<dd>All</dd>
				{/if}
			</section>

			<section class="row">
				<dt>Has Deployed Router?</dt>

				<dd>
					{cluster.deploy_router ? 'Yes' : 'No'}
				</dd>
			</section>

			{#if cluster.router?.ip}
				<section class="row">
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
			<section class="row">
				<dt>Status</dt>

				<dd>
					{cluster.locked ? 'Updating' : cluster.healthy ? 'Healthy' : 'Unhealthy'}
				</dd>
			</section>

			{#if cluster.tfstate}
				<section class="column">
					<dt>Terraform State</dt>
	
					<dd>
						<output>
							<pre><code>{JSON.stringify(JSON.parse(cluster.tfstate), null, '\t')}</code></pre>
						</output>
					</dd>
				</section>
			{/if}

			{#if cluster.error}
				<section class="column">
					<dt>Error</dt>
	
					<dd>
						<output>
							<pre><code>{cluster.error}</code></pre>
						</output>
					</dd>
				</section>
			{/if}
		</dl>
	</section>

	<section>
		<h3>Nodes</h3>

		<!-- <NodesTable
			nodes={cluster.nodes}
		/> -->
		<NodesTable
			{nodesWithInfo}
		/>
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
		width: 4em;
		height: 4em;
		border-radius: 0.25em;
		padding: 0.5em;

		background-color: var(--color-ritualBlack);
		color: #fff;
	}

	output {
		font-size: 0.75em;

		& pre {
			overflow-y: auto;
			max-height: 15.6rem;
			padding: 1em;

			background: rgba(0, 0, 0, 0.05);
			border-radius: 0.5em;

			tab-size: 2;

			& code {
				white-space: pre-wrap;
				word-break: break-word;
			}
		}
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

		&:before {
			content: '⏺';
			margin-right: 0.33em;
			color: var(--status-color)
		}
	}
</style>
