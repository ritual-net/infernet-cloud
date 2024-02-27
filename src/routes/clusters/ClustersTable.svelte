<script lang="ts">
	// Types
	import type { getClustersForUser } from '$/lib/db/queries'


	// Functions
	import { resolveRoute } from '$app/paths'


	// Inputs
	export let clusters: Awaited<ReturnType<typeof getClustersForUser>>


	// Components
	import Table from '$components/Table.svelte'
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
/>
