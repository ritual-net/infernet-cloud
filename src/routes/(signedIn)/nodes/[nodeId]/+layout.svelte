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


<slot />
