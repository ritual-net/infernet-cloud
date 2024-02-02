<script lang="ts">
	// Types/constants
	import { providers } from '$types/provider'


	// Context
	import { page } from '$app/stores'

	$: serviceAccounts = $page.data.serviceAccounts


	// Components
	import Table from '$components/Table.svelte'
</script>


<section class="column">
	<header class="row">
		<h2>Service Accounts</h2>

		{#if serviceAccounts.length}
			<button class="primary">
				Connect Service Account
			</button>
		{/if}
	</header>

	{#if serviceAccounts.length}
		<Table
			data={serviceAccounts}
			columns={[
				{
					header: 'Name',
					accessor: serviceAccount => serviceAccount.name,
				},
				{
					header: 'Cloud Provider',
					accessor: serviceAccount => providers[serviceAccount.provider].name,
				},
			]}
		/>
	{:else}
		<div class="card column">
			<p>You have not connected any service accounts.</p>

			<a href="/service-accounts/create">
				<button class="primary">
					Connect
				</button>
			</a>
		</div>
	{/if}
</section>
