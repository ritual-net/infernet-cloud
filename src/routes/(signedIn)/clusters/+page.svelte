<script lang="ts">
	// Context
	import { page } from '$app/stores'

	$: clusters = $page.data.clusters


	// Actions
	import { onMount } from 'svelte'
	import { invalidate } from '$app/navigation'

	onMount(() => {
		let isMounted = true

		;(async () => {
			while(isMounted) {
				await new Promise(resolve => setTimeout(resolve, 5000))
				if(!isMounted) return

				await invalidate($page.url)
			}
		})()

		return () => {
			isMounted = false
		}
	})


	// Components
	import DropdownMenu from '$/components/DropdownMenu.svelte'
	import ClustersTable from './ClustersTable.svelte'
</script>


<div class="column">
	<header class="row">
		<h2>Clusters</h2>

		<div class="row">
			<a
				class="button primary"
				href="/clusters/create"
			>
				Create Cluster
			</a>

			<DropdownMenu
				labelText="Actions"
				items={[
					{
						value: 'refresh',
						label: 'Refresh',
						onClick: () => {
							invalidate(`/api/clusters`)
						},
					},
				]}
			/>
		</div>
	</header>

	<section>
		<ClustersTable
			{clusters}
		/>
	</section>
</div>
