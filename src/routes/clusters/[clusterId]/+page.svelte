<script lang="ts">
	// Types/constants
	import { providers } from '$/types/provider'


	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	$: ({
		cluster
	} = $page.data as PageData)


	// Functions
	import { resolveRoute } from '$app/paths'


	// Components
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

			<div class="column">
				<h2>
					{cluster.name || cluster.id}
				</h2>

				<!-- <p>Created {cluster.created}</p> -->
			</div>
		</div>

		<div class="row">
			<dl class="card inline">
				<div class="row">
					<dt>Status</dt>
					<dd>{cluster.healthy ? 'Healthy' : 'Unhealthy'}</dd>
				</div>
			</dl>

		<a
			href={resolveRoute(`/clusters/[clusterId]/edit`, {
				clusterId: $page.params.clusterId,
			})}
			class="button primary"
		>Edit Cluster</a>
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
		</dl>
	</section>

	<div>
		<h3>Nodes</h3>

		<NodesTable
			nodes={cluster.nodes}
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
		width: 4em;
		height: 4em;
		border-radius: 0.25em;
		padding: 0.5em;

		background-color: var(--color-ritualBlack);
		color: #fff;
	}
</style>
