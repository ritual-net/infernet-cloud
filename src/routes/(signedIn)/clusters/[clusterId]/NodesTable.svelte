<script lang="ts">
	// Types/constants
	import type { InfernetNodeWithInfo } from '$/types/provider'


	// Inputs
	export let clusterStatus: string
	export let nodesWithInfo: InfernetNodeWithInfo[]


	// Functions
	import { resolveRoute } from '$app/paths'
	import { isTruthy } from '$/lib/utils/isTruthy'


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
					clusterStatus,
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
					clusterStatus,
				})
			),
		},
		{
			header: 'Containers',
			accessor: nodeWithInfo => (
				nodeWithInfo.node?.containers?.length ?? '–'
			),
		},
		{
			header: 'Docker account',
			accessor: nodeWithInfo => nodeWithInfo,
			cell: ({ value: nodeWithInfo }) => (
				createRender(NodesTableCell, {
					cellType: CellType.DockerAccount,
					nodeWithInfo,
				})
			),
		},
		{
			header: 'Chain',
			accessor: nodeWithInfo => nodeWithInfo,
			cell: ({ value: nodeWithInfo }) => (
				createRender(NodesTableCell, {
					cellType: CellType.Chain,
					nodeWithInfo,
				})
			),
		},
		{
			header: 'Payment address',
			accessor: nodeWithInfo => (
				nodeWithInfo.node?.payment_address ?? '–'
			),
		},
		// {
		// 	header: 'Ignored simulation errors',
		// 	accessor: nodeWithInfo => (
		// 		nodeWithInfo.node.allowed_sim_errors?.length ? `${nodeWithInfo.node.allowed_sim_errors.length} substrings` : '–',
		// 	),
		// },
	]}
	getRowLink={nodeWithInfo => (
		nodeWithInfo.node && resolveRoute(`/nodes/[nodeId]`, {
			nodeId: nodeWithInfo.node.id,
		})
	)}
	contextMenu={nodeWithInfo => {
		const { node, info } = nodeWithInfo

		if(!node) return []

		const nodeRoute = resolveRoute(`/nodes/[nodeId]`, {
			nodeId: node.id,
		})

		return [
			['stopped', 'terminated'].includes(info?.status) && {
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
			['running'].includes(info?.status) && {
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
			.filter(isTruthy)
	}}
>
	<svelte:fragment slot="loading">
		<p>Loading nodes...</p>
	</svelte:fragment>

	<svelte:fragment slot="error">
		<p>Failed to load nodes.</p>
	</svelte:fragment>

	<svelte:fragment slot="empty">
		<p>You have not yet configured any nodes.</p>
	</svelte:fragment>
</Table>
