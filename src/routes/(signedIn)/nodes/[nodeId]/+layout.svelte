<script lang="ts">
	// Context
	import { page } from '$app/stores'

	let {
		node
	} = $page.data

	
	// Actions
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	import { resolveRoute } from '$app/paths'

	onMount(() => {
		let isMounted = true

		;(async () => {
			while(isMounted) {
				await new Promise(resolve => setTimeout(resolve, 5000))
				if(!isMounted) return

				await invalidate(
					resolveRoute('/api/node/[nodeId]', {
						nodeId: $page.params.nodeId,
					})
				)
			}
		})()

		return () => {
			isMounted = false
		}
	})
</script>


<nav class="breadcrumb">
	<a
		href={resolveRoute(`/clusters/[clusterId]`, { clusterId: node.cluster.id })}
		class="row inline"
	>
		<span>←</span>
		<span>{node.cluster.name}</span>
	</a>
</nav>

<slot />


<style>
	nav {
		& a {
			opacity: 0.5;
		}
	}
</style>
