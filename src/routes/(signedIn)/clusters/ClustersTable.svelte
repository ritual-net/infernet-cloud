<script lang="ts">
	// Types
	import type { getClustersForUser } from '$/lib/db/queries'


	// Context
	import { page } from '$app/stores'


	// Functions
	import { resolveRoute } from '$app/paths'
	import { goto, invalidate } from '$app/navigation'


	// Inputs
	export let clusters: Awaited<ReturnType<typeof getClustersForUser>>


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
			header: 'Cloud Account',
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
						data: {
							type: 'default',
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
						formAction: `${clusterRoute}?/destroy`,
						formSubmit: async (e) => {
							const toast = addToast({
								data: {
									type: 'default',
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
						formAction: `${clusterRoute}?/delete`,
						formSubmit: async (e) => {
							const toast = addToast({
								data: {
									type: 'default',
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
	<p>You have not created any clusters.</p>
</Table>
