<script lang="ts">
	// Types/constants
	import type { InfernetNode } from '$schema/interfaces'


	// Inputs
	export let nodes: InfernetNode[]


	// Functions
	import { formatNumberCompact } from '$/lib/format'
	import { resolveRoute } from '$app/paths'


	// Actions
	import { applyAction } from '$app/forms'
	import { invalidate } from '$app/navigation'


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
			accessor: node => (
				typeof node.max_gas_limit === 'number' && formatNumberCompact(node.max_gas_limit)
			),
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
	getRowLink={node => (
		resolveRoute(`/nodes/[nodeId]`, {
			nodeId: node.id,
		})
	)}
	contextMenu={node => {
		const nodeRoute = resolveRoute(`/nodes/[nodeId]`, {
			nodeId: node.id,
		})

		return [
			{
				value: 'start',
				label: 'Start Node',
				formAction: `${nodeRoute}?/start`,
				formSubmit: async () => {
					return async ({ result }) => {
						if(result.type === 'failure')
							alert(result.data?.result?.message)

						else {
							await applyAction(result)

							await invalidate('.')
						}
					}
				},
			},
			{
				value: 'stop',
				label: 'Stop Node',
				formAction: `${nodeRoute}?/stop`,
				formSubmit: async () => {
					return async ({ result }) => {
						if(result.type === 'failure')
							alert(result.data?.result?.message)

						else {
							await applyAction(result)

							await invalidate('.')
						}
					}
				},
			},
		]
	}}
/>
