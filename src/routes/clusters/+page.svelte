<script lang="ts">
	// Context
	import { page } from '$app/stores'

	$: clusters = $page.data.clusters


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

	<section>
		<ClustersTable
			{clusters}
		/>
	</section>
</div>
