<script lang="ts">
	// Types/constants
	import type { InferType } from 'yup'
	import type { Container } from './schema'


	// Inputs
	export let containers: Promise<InferType<typeof Container>[]>


	// Events
	export let onEdit: (_: InferType<typeof Container>) => void


	// Components
	import { createRender } from 'svelte-headless-table'
	import Table from '$/components/Table.svelte'
	import NodeContainersTableCell, { CellType } from './NodeContainersTableCell.svelte'
</script>


<Table
	data={containers}
	getId={container => container.id}
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
	onRowClick={container => {
		onEdit?.(container)
	}}
	contextMenu={container => [
		{
			value: 'edit',
			label: 'Edit container',
			onClick: () => {
				onEdit?.(container)
			},
		},
		{
			value: 'duplicate',
			label: 'Duplicate container',
			onClick: () => {
				containers = containers.toSpliced(
					containers.indexOf(container) + 1,
					0,
					Object.assign({}, container, { id: crypto.randomUUID() }),
				)
			},
		},
		{
			value: 'delete',
			label: 'Delete container',
			isDestructive: true,
			onClick: () => {
				containers = containers.filter(_container => _container !== container)
			},
		},
	]}
	layout="card"
>
	<svelte:fragment slot="loading">
		<p>Loading containers...</p>
	</svelte:fragment>

	<svelte:fragment slot="error">
		<p>Failed to load containers.</p>
	</svelte:fragment>

	<svelte:fragment slot="empty">
		<p>You have not yet configured any containers.</p>
	</svelte:fragment>
</Table>
