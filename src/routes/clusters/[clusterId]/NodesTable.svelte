<script lang="ts">
	// Types/constants
	import type { InfernetNode } from '$schema/interfaces'


	// Inputs
	export let nodes: InfernetNode[]


	// Components
	import { createRender } from 'svelte-headless-table'
	import Table from '$/components/Table.svelte'
	import NodesTableCell, { CellType } from './NodesTableCell.svelte'
</script>


<Table
	data={nodes}
	columns={[
		{
			header: 'Name',
			accessor: node => node.id,
		},
		{
			header: 'Status',
			accessor: node => node,
			cell: ({ value: node }) => (
				createRender(NodesTableCell, {
					cellType: CellType.Status,
					node,
				})
			),
		},
		{
			header: 'Coordinator Address',
			accessor: node => node.coordinator_address,
		},
		{
			header: 'Gas Limit',
			accessor: node => node.max_gas_limit,
		},
		{
			header: 'Containers',
			accessor: node => node.containers.length,
		},
		{
			header: 'Actions',
			accessor: node => node,
			cell: ({ value: node }) => (
				createRender(NodesTableCell, {
					cellType: CellType.Actions,
					node,
				})
			),
		},
	]}
/>
