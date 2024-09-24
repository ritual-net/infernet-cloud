<script lang="ts">
	// Context
	import { page } from '$app/stores'

	let {
		nodeWithInfo: {
			node,
		},
	} = $page.data

	
	// Actions
	import { resolveRoute } from '$app/paths'
</script>


<nav class="breadcrumb">
	<a
		href={resolveRoute(`/nodes/[nodeId]`, { nodeId: node.id })}
		class="row inline"
	>
		<span>←</span>
		<span>{node?.state?.id ?? node?.id ?? 'Node'}</span>
	</a>

	<!-- <a
		href={resolveRoute(`/clusters/[clusterId]`, { clusterId: node.cluster.id })}
		class="row inline"
	>
		<span>←</span>
		<span>{node.cluster.name}</span>
	</a>

	/

	<a
		href={resolveRoute(`/nodes/[nodeId]`, { nodeId: node.id })}
		class="row inline"
	>
		<span>{node?.state?.id ?? node?.id ?? 'Node'}</span>
	</a> -->
</nav>

<slot />


<style>
	nav {
		& a {
			opacity: 0.5;
		}
	}
</style>
