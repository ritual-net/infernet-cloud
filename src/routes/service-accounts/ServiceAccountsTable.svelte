<script lang="ts">
	// Types/constants
	import type { QueriedServiceAccount } from '../api/service_account/+server'


	// Inputs
	export let serviceAccounts: QueriedServiceAccount[]


	// Components
	import { createRender } from 'svelte-headless-table'
	import Table from '$/components/Table.svelte'
	import ServiceAccountsTableCell, { CellType } from './ServiceAccountsTableCell.svelte'
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
				createRender(ServiceAccountsTableCell, {
					cellType: CellType.CloudProvider,
					serviceAccount,
				})
			),
		},
	]}
/>
