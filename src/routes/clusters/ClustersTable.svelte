<script lang="ts">
	// Types
	import type { getClustersForUser } from '$/lib/db/queries'


	// Functions
	import { resolveRoute } from '$app/paths'
	import { goto } from '$app/navigation'


	// Inputs
	export let clusters: Awaited<ReturnType<typeof getClustersForUser>>


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
			header: 'Service Account',
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
			accessor: cluster => cluster.healthy ? 'Healthy' : 'Unhealthy',
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
				label: 'Edit Cluster',
				onClick: () => {
					goto(`${clusterRoute}/edit`)
				},
			},
			{
				value: 'delete',
				label: 'Delete Cluster',
				formAction: `${clusterRoute}?/delete`,
				formSubmit: () => {
					return async ({ result }) => {
						if(result.type === 'failure')
							alert(result.data?.result?.message)

						else {
							await invalidate('.')
							alert(result.data?.result?.message)
						}
					}
				},
			},
		]
	}}
/>
