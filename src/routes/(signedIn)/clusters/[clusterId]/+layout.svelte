<script lang="ts">
	// Context
	import { page } from '$app/stores'
	
	
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

				await invalidate(resolveRoute('/api/cluster/[clusterId]', { clusterId: $page.params.clusterId }))
			}
		})()

		return () => {
			isMounted = false
		}
	})
</script>


<nav class="breadcrumb">
	<a
		href="/clusters"
		class="row inline"
	>
		<span>←</span>
		<span>Clusters</span>
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
