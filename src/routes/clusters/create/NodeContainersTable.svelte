<script lang="ts">
	// Types/constants
	import type { Container } from './schema'


	// Inputs
	export let containers: typeof Container[]


	// Events
	export let onEdit: (_: typeof Container) => void


	// Components
	import Table from '$/components/Table.svelte'
</script>


<Table
	data={containers}
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
	contextMenu={container => [
		{
			value: 'edit',
			label: 'Edit Container',
			onClick: () => {
				onEdit?.(container)
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
