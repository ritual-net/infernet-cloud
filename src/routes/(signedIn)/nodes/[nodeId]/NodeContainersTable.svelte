<script lang="ts">
	// Types/constants
	import type { Container } from '$schema/interfaces'


	// Inputs
	export let nodeId: string
	export let containers: Container[]


	// Functions
	import { resolveRoute } from '$app/paths'


	// Components
	import { createRender } from 'svelte-headless-table'
	import Table from '$/components/Table.svelte'
	import NodeContainersTableCell, { CellType } from './NodeContainersTableCell.svelte'
</script>


<Table
	data={containers}
	columns={[
		{
			header: 'Service ID / Description',
			accessor: container => container,
			cell: ({ value: container }) => (
				createRender(NodeContainersTableCell, {
					cellType: CellType.ContainerIdAndDescription,
					container,
				})
			),
		},
		{
			header: 'Image / Command',
			accessor: container => container,
			cell: ({ value: container }) => (
				createRender(NodeContainersTableCell, {
					cellType: CellType.ImageAndCommand,
					container,
				})
			)
		},
		{
			header: 'Visibility',
			accessor: container => container.external ? 'External' : 'Internal',
		},
		{
			header: 'GPU?',
			accessor: container => container.gpu ? 'Yes' : 'No',
		},
		{
			header: 'Firewall?',
			accessor: container => (
				container.allowed_ips?.length && (container.allowed_addresses?.length || container.allowed_delegate_addresses?.length) ?
					'Only allowed IPs and addresses'
				: container.allowed_ips?.length ?
					'Only allowed IPs'
				: container.allowed_addresses?.length || container.allowed_delegate_addresses?.length ?
					'Only allowed addresses'
				:
					'-'
			),
		},
		{
			header: 'Env Vars',
			accessor: container => container.env && Object.entries(container.env).length ? `${Object.entries(container.env).length} variables` : '–',
		},
		{
			header: 'Payments',
			accessor: container => container.accepted_payments?.length ? `${container.accepted_payments.length} tokens` : '–',
		},
		{
			header: 'Proofs?',
			accessor: container => container.generates_proofs ? 'Yes' : 'No',
		},
	]}
	getRowLink={container => (
		resolveRoute(`/nodes/[nodeId]/container/[containerId]`, {
			nodeId,
			containerId: container.id,
		})
	)}
>
	<svelte:fragment slot="empty">
		<p>No containers configured.</p>
	</svelte:fragment>
</Table>
