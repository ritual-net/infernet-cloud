<script lang="ts">
	// Types/constants
	import type { InfernetNodeWithInfo } from '$/types/provider'


	// Inputs
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
			header: 'IP / ID',
			accessor: nodeWithInfo => nodeWithInfo,
			cell: ({ value: nodeWithInfo }) => (
				createRender(NodesTableCell, {
					cellType: CellType.IpAndId,
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
			header: 'Onchain?',
			accessor: ({ node }) => node.chain_enabled ? 'Yes' : 'No',
		},
		{
			header: 'Containers',
			accessor: ({ node }) => node.containers.length,
		},
		{
			header: 'Payment address',
			accessor: ({ node }) => node.payment_address ?? '–',
		},
		// {
		// 	header: 'Ignored simulation errors',
		// 	accessor: ({ node }) => node.allowed_sim_errors?.length ? `${node.allowed_sim_errors.length} substrings` : '–',
		// },
		{
			header: 'Docker account',
			accessor: ({ node }) => node.docker_account ? node.docker_account.username : '–',
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
				label: 'Start node',
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
				label: 'Stop node',
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
