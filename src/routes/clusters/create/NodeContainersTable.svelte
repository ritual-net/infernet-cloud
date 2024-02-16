<script lang="ts">
	// Types/constants
	import type { z } from 'zod'
	import type { Container } from './schema'


	// Inputs
	export let containers: z.infer<typeof Container>[]


	// Events
	export let onEdit: (_: z.infer<typeof Container>) => void


	// Components
	import Table from '$/components/Table.svelte'
</script>


<Table
	data={containers}
	getId={container => container.container_id}
	columns={[
		{
			header: 'Name',
			accessor: container => container.name,
		},
		{
			header: 'Image',
			accessor: container => container.image,
		},
		{
			header: 'Description',
			accessor: container => container.description,
		},
		{
			header: 'Visibility',
			accessor: container => container.external ? 'External' : 'Internal',
		},
		// {
		// 	header: 'Allowed Addresses',
		// 	accessor: container => container.allowed_addresses,
		// },
		// {
		// 	header: 'Allowed Delegate Addresses',
		// 	accessor: container => container.allowed_delegate_addresses,
		// },
		// {
		// 	header: 'Allowed IPs',
		// 	accessor: container => container.allowed_ips,
		// },
		{
			header: 'Command',
			accessor: container => container.command,
		},
		{
			header: 'Env',
			accessor: container => container.env,
		},
		{
			header: 'GPU?',
			accessor: container => container.gpu,
		},
	]}
	onRowClick={container => {
		onEdit?.(container)
	}}
	contextMenu={container => [
		{
			value: 'edit',
			label: 'Edit Container',
			onClick: () => {
				onEdit?.(container)
			},
		},
		{
			value: 'duplicate',
			label: 'Duplicate Container',
			onClick: () => {
				containers = containers.toSpliced(
					containers.indexOf(container) + 1,
					0,
					Object.assign({}, container, { container_id: crypto.randomUUID() }),
				)
			},
		},
		{
			value: 'delete',
			label: 'Delete Container',
			onClick: () => {
				containers = containers.filter(_container => _container !== container)
			},
		},
	]}
>
	No containers found
</Table>
