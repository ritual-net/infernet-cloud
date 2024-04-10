<script lang="ts">
	// Types/constants
	// import type { InfernetNode } from '$schema/interfaces'
	import type { InfernetNodeWithInfo } from '$/types/provider'


	// Context
	import { page } from '$app/stores'


	// Inputs
	// export let nodes: InfernetNode[]
	export let nodesWithInfo: InfernetNodeWithInfo[]


	// Functions
	import { formatNumberCompact } from '$/lib/format'
	import { resolveRoute } from '$app/paths'


	// Actions
	import { applyAction } from '$app/forms'
	import { invalidate } from '$app/navigation'
	import { addToast, removeToast } from '$/components/Toaster.svelte'


	// Components
	import { createRender } from 'svelte-headless-table'
	import Table from '$/components/Table.svelte'
	import NodesTableCell, { CellType } from './NodesTableCell.svelte'
</script>


<Table
	data={nodesWithInfo}
	columns={[
		{
			header: 'Name',
			accessor: ({ node }) => node.id,
		},
		{
			header: 'Status',
			accessor: ({ node }) => node,
			cell: ({ value: { node, nodeInfo } }) => (
				createRender(NodesTableCell, {
					cellType: CellType.Status,
					node,
					nodeInfo,
				})
			),
		},
		{
			header: 'IP',
			accessor: ({ info }) => info?.ip ?? '–',
		},
		{
			header: 'Coordinator Address',
			accessor: ({ node }) => node.coordinator_address,
		},
		{
			header: 'Gas Limit',
			accessor: ({ node }) => (
				typeof node.max_gas_limit === 'number' && formatNumberCompact(node.max_gas_limit)
			),
		},
		{
			header: 'Containers',
			accessor: ({ node }) => node.containers.length,
		},
	]}
	getRowLink={({ node }) => (
		resolveRoute(`/nodes/[nodeId]`, {
			nodeId: node.id,
		})
	)}
	contextMenu={({ node }) => {
		const nodeRoute = resolveRoute(`/nodes/[nodeId]`, {
			nodeId: node.id,
		})

		return [
			{
				value: 'start',
				label: 'Start Node',
				formAction: `${nodeRoute}?/start`,
				formSubmit: async (e) => {
					const toast = addToast({
						data: {
							type: 'default',
							title: 'Starting node...',
						},
					})

					invalidate($page.url)

					return async ({ result }) => {
						await applyAction(result)

						if(result.type === 'success')
							await invalidate($page.url)

						removeToast(toast.id)
					}
				},
			},
			{
				value: 'stop',
				label: 'Stop Node',
				formAction: `${nodeRoute}?/stop`,
				formSubmit: async (e) => {
					const toast = addToast({
						data: {
							type: 'default',
							title: 'Stopping node...',
						},
					})

					invalidate($page.url)

					return async ({ result }) => {
						await applyAction(result)

						if(result.type === 'success')
							await invalidate($page.url)

						removeToast(toast.id)
					}
				},
			},
		]
	}}
>
	<p>No nodes configured.</p>
</Table>
