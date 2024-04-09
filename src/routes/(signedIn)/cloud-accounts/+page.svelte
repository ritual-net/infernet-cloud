<script lang="ts">
	// Context
	import { page } from '$app/stores'

	$: serviceAccounts = $page.data.serviceAccounts


	// Components
	import ServiceAccountsTable from './ServiceAccountsTable.svelte'
</script>


<section class="column">
	<header class="row">
		<h2>Cloud Accounts</h2>

		<a
			class="button primary"
			href="/service-accounts/create"
		>Connect Cloud Account</a>
	</header>

	<ServiceAccountsTable
		{serviceAccounts}
	/>
</section>
