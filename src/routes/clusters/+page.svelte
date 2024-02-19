<script lang="ts">
	// Context
	import { page } from '$app/stores'

	$: clusters = $page.data.clusters ?? [
		{ id: '1', name: 'Cluster A' },
		{ id: '2', name: 'Cluster B' },
	]


	// Components
	import Table from '$components/Table.svelte'
</script>


<div class="column">
	<header class="row">
		<h2>Clusters</h2>

		{#if clusters.length}
			<button class="primary">
				Create Cluster
			</button>
		{/if}
	</header>

	{#if clusters.length}
		<section class="card">
			<Table
				data={clusters}
				columns={[
					{
						header: 'Id',
						accessor: d => d.id,
					},
					{
						header: 'Name',
						accessor: d => d.name,
					},
				]}
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
