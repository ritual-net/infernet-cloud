<script lang="ts">
	// Context
	import { page } from '$app/stores'

	$: clusters = $page.data.clusters ?? [
		{ id: '1', name: 'Cluster A' },
		{ id: '2', name: 'Cluster B' },
	]


	// Components
	import ClustersTable from './ClustersTable.svelte'
</script>


<div class="column">
	<header class="row">
		<h2>Clusters</h2>

		{#if clusters.length}
			<a
				class="button primary"
				href="/clusters/create"
			>
				Create Cluster
			</a>
		{/if}
	</header>

	{#if clusters.length}
		<section class="card">
			<ClustersTable
				{clusters}
			/>
		</section>
	{:else}
		<div class="card column">
			<p>You have not created any clusters.</p>

			<a
				class="button primary"
				href="/clusters/create"
			>
				Create Cluster
			</a>
		</div>
	{/if}
</div>
