<script lang="ts">
	// Context
	import { page } from '$app/stores'

	$: ({
		clustersPromise,
	} = $page.data)


	// Actions
	import { onMount } from 'svelte'
	import { invalidate } from '$app/navigation'
	import { addToast, removeToast } from '$/components/Toaster.svelte'

	onMount(() => {
		let isMounted = true

		;(async () => {
			while (isMounted) {
				await new Promise((resolve) => setTimeout(resolve, 5000))
				if (!isMounted) return

				await invalidate('/api/cluster')
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


<svelte:head>
	<title>Clusters | Infernet Cloud</title>
</svelte:head>


<div class="column">
	<header class="row">
		<h2>Clusters</h2>

		<div class="row">
			<a
				class="button primary"
				href="/clusters/create"
			>
				Create cluster
			</a>

			<DropdownMenu
				labelText="Actions"
				items={[
					{
						value: 'refresh',
						label: 'Refresh data',
						onClick: async () => {
							const toast = addToast({
								closeDelay: 0,
								data: {
									type: 'loading',
									title: `Refreshing data...`,
								},
							})

							await invalidate(`/api/cluster`)

							removeToast(toast.id)
						},
					},
				]}
			/>
		</div>
	</header>

	<section>
		<ClustersTable
			clusters={clustersPromise}
		/>
	</section>
</div>
