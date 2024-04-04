<script lang="ts">
	// Types/constants
	import type { Container } from '$schema/interfaces'


	// Inputs
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
			header: 'ID',
			accessor: container => container.container_id,
		},
		// {
		// 	header: 'Image',
		// 	accessor: container => container.image,
		// },
		// {
		// 	header: 'Allowed IPs',
		// 	accessor: container => container.allowed_ips.length ? container.allowed_ips.join(', ') : 'All',
		// },
		// {
		// 	header: 'Allowed ',
		// 	accessor: container => container.gpu
		// },
		// {
		// 	header: 'Cloud Provider',
		// 	accessor: container => container,
		// 	cell: ({ value: container }) => (
		// 		createRender(NodeContainersTableCell, {
		// 			cellType: CellType.CloudProvider,
		// 			container,
		// 		})
		// 	),
		// },
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
		// {
		// 	header: 'Env',
		// 	accessor: container => container.env,
		// },
		{
			header: 'GPU?',
			accessor: container => container.gpu,
		},
	]}
	getRowLink={container => (
		resolveRoute(`/service-accounts/[containerId]`, {
			containerId: container.id,
		})
	)}
>
	<p>No containers configured.</p>
</Table>
