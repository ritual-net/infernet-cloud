<script lang="ts">
	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	$: ({
		cluster
	} = $page.data as PageData)
$: console.log({cluster})


	// Components
	import NodesTable from './NodesTable.svelte'
	import { resolveRoute } from '$app/paths';
</script>


<div class="container column">
	<header class="row wrap">
		<div class="column">
			<h3>
				{cluster.name || cluster.id}
			</h3>

			<!-- <p>Created {cluster.created}</p> -->
		</div>

		<a
			href={resolveRoute(`/clusters/[clusterId]/edit`, {
				clusterId: $page.params.clusterId,
			})}
			class="button"
		>Edit</a>
	</header>

	<section class="column">
		<h3>Details</h3>

		<dl class="card">
			<section class="row">
				<dt>Service Account</dt>

				<dd>
					<a
						href={resolveRoute(`/service-accounts/[serviceAccountId]`, {
							serviceAccountId: cluster.service_account.id,
						})}
					>
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
					All
				{/if}
			</section>

			<section class="row">
				<dt>Deploy Router</dt>

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
</style>
