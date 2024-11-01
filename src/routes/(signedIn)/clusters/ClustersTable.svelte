<script lang="ts">
	// Types
	import type { getClusters } from '$/lib/db/queries'


	// Context
	import { page } from '$app/stores'


	// Functions
	import { resolveRoute } from '$app/paths'
	import { goto, invalidate } from '$app/navigation'


	// Inputs
	export let clusters: ReturnType<typeof getClusters>


	// Actions
	import { applyAction } from '$app/forms'
	import { addToast, removeToast } from '$/components/Toaster.svelte'


	// Components
	import Table from '$/components/Table.svelte'
	import ClustersTableCell, { CellType } from './ClustersTableCell.svelte'
	import { createRender } from 'svelte-headless-table'
</script>


<Table
	data={clusters}
	getId={cluster => cluster.id}
	columns={[
		// {
		// 	header: 'Id',
		// 	accessor: cluster => cluster.id,
		// },
		{
			header: 'Name',
			accessor: cluster => cluster.name,
		},
		{
			header: 'Cloud account / Location',
			accessor: cluster => cluster,
			cell: ({ value: cluster }) => (
				createRender(ClustersTableCell, {
					cellType: CellType.ServiceAccount,
					cluster,
				})
			),
		},
		{
			header: 'Nodes',
			accessor: cluster => cluster.node_count,
		},
		{
			header: 'Status',
			accessor: cluster => cluster,
			cell: ({ value: cluster }) => (
				createRender(ClustersTableCell, {
					cellType: CellType.Status,
					cluster,
				})
			),
		},
	]}
	getRowLink={cluster => (
		resolveRoute(`/clusters/[clusterId]`, { clusterId: cluster.id })
	)}
	contextMenu={cluster => {
		const clusterRoute = resolveRoute(`/clusters/[clusterId]`, {
			clusterId: cluster.id,
		})

		return [
			{
				value: 'edit',
				label: 'Edit cluster',
				onClick: () => {
					goto(`${clusterRoute}/edit`)
				},
			},
			{
				value: 'apply',
				label: (
					cluster.status !== 'destroyed'
						? 'Trigger update'
						: 'Recreate cluster'
				),
				formAction: `${clusterRoute}?/apply`,
				formSubmit: async (e) => {
					const toast = addToast({
						closeDelay: 0,
						data: {
							type: 'loading',
							title: (
								cluster.status !== 'destroyed' ?
									`Applying changes to cluster "${cluster.name}"...`
								:
									`Recreating cluster "${cluster.name}"...`
							)
						},
					})

					setTimeout(() => {
						invalidate(`/api/cluster`)
					}, 500)

					return async ({ result }) => {
						await applyAction(result)

						if(result.type === 'success')
							invalidate(`/api/cluster`)

						removeToast(toast.id)
					}
				},
			},
			(
				cluster.status !== 'destroyed'
					? {
						value: 'destroy',
						label: 'Destroy cluster',
						isDestructive: true,
						formAction: `${clusterRoute}?/destroy`,
						formSubmit: async (e) => {
							const toast = addToast({
								closeDelay: 0,
								data: {
									type: 'loading',
									title: `Destroying cluster "${cluster.name}"...`,
								},
							})

							return async ({ result }) => {
								await applyAction(result)

								if(result.type === 'success')
									invalidate(`/api/cluster`)

								removeToast(toast.id)
							}
						},
					}
					: {
						value: 'delete',
						label: 'Delete cluster',
						isDestructive: true,
						formAction: `${clusterRoute}?/delete`,
						formSubmit: async (e) => {
							const toast = addToast({
								closeDelay: 0,
								data: {
									type: 'loading',
									title: `Deleting cluster "${cluster.name}"...`,
								},
							})

							return async ({ result }) => {
								await applyAction(result)

								if(result.type === 'success')
									invalidate(`/api/cluster`)

								removeToast(toast.id)
							}
						},
					}
			),
		]
	}}
>
	<svelte:fragment slot="loading">
		<p>Loading clusters...</p>
	</svelte:fragment>

	<svelte:fragment slot="error">
		<p>Failed to load clusters.</p>
	</svelte:fragment>

	<svelte:fragment slot="empty">
		<p>You have not created any clusters.</p>
	</svelte:fragment>
</Table>
