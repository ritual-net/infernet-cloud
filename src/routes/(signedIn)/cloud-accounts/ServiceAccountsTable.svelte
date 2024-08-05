<script lang="ts">
	// Types/constants
	import type { QueriedServiceAccount } from '$/routes/api/service_account/+server'
	import { providers } from '$/types/provider'


	// Inputs
	export let serviceAccounts: QueriedServiceAccount[]


	// Functions
	import { resolveRoute } from '$app/paths'


	// Components
	import { createRender } from 'svelte-headless-table'
	import Table from '$/components/Table.svelte'
	import WithIcon from '$/components/WithIcon.svelte'
</script>


<Table
	data={serviceAccounts}
	columns={[
		{
			header: 'Name',
			accessor: serviceAccount => serviceAccount.name,
		},
		{
			header: 'Cloud Provider',
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
>
	<p>No cloud accounts configured.</p>
</Table>
