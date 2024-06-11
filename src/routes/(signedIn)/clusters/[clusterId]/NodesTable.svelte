<script lang="ts">
	// Types/constants
	// import type { InfernetNode } from '$schema/interfaces'
	import type { InfernetNodeWithInfo } from '$/types/provider'


	// Inputs
	// export let nodes: InfernetNode[]
	export let nodesWithInfo: InfernetNodeWithInfo[]


	// Functions
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
			header: 'ID',
			accessor: nodeWithInfo => nodeWithInfo,
			cell: ({ value: nodeWithInfo }) => (
				createRender(NodesTableCell, {
					cellType: CellType.ID,
					nodeWithInfo,
				})
			),
		},
		{
			header: 'Status',
			accessor: nodeWithInfo => nodeWithInfo,
			cell: ({ value: nodeWithInfo }) => (
				createRender(NodesTableCell, {
					cellType: CellType.Status,
					nodeWithInfo,
				})
			),
		},
		{
			header: 'IP',
			accessor: ({ info }) => info?.ip ?? '–',
		},
		{
			header: 'Chain Enabled?',
			accessor: ({ node }) => node.chain_enabled ? 'Yes' : 'No',
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

					setTimeout(() => {
						invalidate(resolveRoute(`/api/node/[nodeId]`, { nodeId: node.id }))
					}, 500)

					return async ({ result }) => {
						await applyAction(result)

						if(result.type === 'success')
							invalidate(resolveRoute(`/api/node/[nodeId]`, { nodeId: node.id }))

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

					setTimeout(() => {
						invalidate(resolveRoute(`/api/node/[nodeId]`, { nodeId: node.id }))
					}, 500)

					return async ({ result }) => {
						await applyAction(result)

						if(result.type === 'success')
							invalidate(resolveRoute(`/api/node/[nodeId]`, { nodeId: node.id }))

						removeToast(toast.id)
					}
				},
			},
		]
	}}
>
	<p>No nodes configured.</p>
</Table>
