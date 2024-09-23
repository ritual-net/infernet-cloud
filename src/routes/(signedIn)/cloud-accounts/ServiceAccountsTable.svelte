<script lang="ts">
	// Types/constants
	import type { QueriedServiceAccount } from '$/routes/api/service_account/+server'
	import { providers } from '$/types/provider'


	// Inputs
	export let serviceAccounts: Promise<QueriedServiceAccount[]>


	// Actions
	import { addToast, removeToast } from '$/components/Toaster.svelte'
	import { applyAction } from '$app/forms'
	import { invalidateAll } from '$app/navigation'


	// Functions
	import { resolveRoute } from '$app/paths'


	// Components
	import { createRender } from 'svelte-headless-table'
	import Table from '$/components/Table.svelte'
	import WithIcon from '$/components/WithIcon.svelte'
</script>


<Table
	data={serviceAccounts}
	getId={serviceAccount => serviceAccount.id}
	columns={[
		{
			header: 'Name',
			accessor: serviceAccount => serviceAccount.name,
		},
		{
			header: 'Cloud provider',
			accessor: serviceAccount => serviceAccount,
			cell: ({ value: serviceAccount }) => (
				createRender(WithIcon, {
					icon: providers[serviceAccount.provider].icon,
					alt: providers[serviceAccount.provider].name,
					value: providers[serviceAccount.provider].name,
				})
			),
		},
	]}
	getRowLink={serviceAccount => (
		resolveRoute(`/cloud-accounts/[serviceAccountId]`, {
			serviceAccountId: serviceAccount.id,
		})
	)}
	contextMenu={serviceAccount => [
		{
			value: 'delete',
			label: 'Disconnect',
			isDestructive: true,
			formAction: `${resolveRoute(`/cloud-accounts/[serviceAccountId]`, {
				serviceAccountId: serviceAccount.id,
			})}?/delete`,
			formSubmit: async (e) => {
				const toast = addToast({
					closeDelay: 0,
					data: {
						type: 'default',
						title: `Disconnecting "${serviceAccount.name}"...`,
					},
				})

				return async ({ result }) => {
					await applyAction(result)

					if(result.type === 'success')
						invalidateAll()

					removeToast(toast.id)
				}
			},
		},
	]}
>
	<svelte:fragment slot="loading">
		<p>Loading cloud accounts...</p>
	</svelte:fragment>

	<svelte:fragment slot="error">
		<p>Failed to load cloud accounts.</p>
	</svelte:fragment>

	<svelte:fragment slot="empty">
		<p>You have not yet configured any cloud accounts.</p>
	</svelte:fragment>
</Table>
