<script lang="ts">
	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	$: ({
		cluster
	} = $page.data as PageData)


	// Components
	import NodesTable from './NodesTable.svelte'
	import { resolveRoute } from '$app/paths';
</script>


<header class="row wrap">
	<div class="column">
		<h3>
			{cluster.name}
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

<div>
	<h3>Nodes</h3>

	<NodesTable
		nodes={cluster.nodes}
	/>
</div>
