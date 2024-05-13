<script lang="ts">
	// Types
	import type { ContainerTemplate } from '$schema/interfaces'


	// Functions
	import { resolveRoute } from '$app/paths'
	import { goto, invalidate } from '$app/navigation'


	// Inputs
	export let containerTemplates: ContainerTemplate[]


	// Actions
	import { applyAction } from '$app/forms'
	import { addToast, removeToast } from '$/components/Toaster.svelte'


	// Components
	import Table from '$/components/Table.svelte'
	import ContainerTemplatesTableCell, { CellType } from './ContainerTemplatesTableCell.svelte'
	import { createRender } from 'svelte-headless-table'
</script>


<Table
	data={containerTemplates}
	columns={[
		{
			header: 'Name',
			accessor: container => container.name,
		},
		{
			header: 'Service ID',
			accessor: container => container,
			cell: ({ value: container }) => (
				createRender(ContainerTemplatesTableCell, {
					cellType: CellType.ID,
					container,
				})
			),
		},
		// {
		// 	header: 'Allowed IPs',
		// 	accessor: container => container.allowed_ips.length ? container.allowed_ips.join(', ') : 'All',
		// },
		// {
		// 	header: 'Cloud Provider',
		// 	accessor: container => container,
		// 	cell: ({ value: container }) => (
		// 		createRender(ContainerTemplatesTableCell, {
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
		// {
		// 	header: 'Command',
		// 	accessor: container => container.command,
		// },
		// {
		// 	header: 'Env',
		// 	accessor: container => container.env,
		// },
		{
			header: 'GPU?',
			accessor: container => container.gpu,
		},
	]}
	getRowLink={containerTemplate => (
		resolveRoute(`/templates/[containerTemplateId]`, { containerTemplateId: containerTemplate.id })
	)}
	contextMenu={containerTemplate => {
		const containerTemplateRoute = resolveRoute(`/templates/[containerTemplateId]`, {
			containerTemplateId: containerTemplate.id,
		})

		return [
			{
				value: 'delete',
				label: 'Delete Container Template',
				formAction: `/api/container_template/${containerTemplate.id}`,
				formMethod: 'DELETE',
				formSubmit: async (e) => {
					const toast = addToast({
						data: {
							type: 'default',
							title: `Deleting container template "${containerTemplate.name}"...`,
						},
					})

					return async ({ result }) => {
						await applyAction(result)

						if(result.type === 'success')
							invalidate(`/api/container_template`)

						removeToast(toast.id)
					}
				},
			},
		]
	}}
>
	<p>You have not created any container templates.</p>
</Table>
