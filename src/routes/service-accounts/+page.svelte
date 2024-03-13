<script lang="ts">
	// Context
	import { page } from '$app/stores'

	$: serviceAccounts = $page.data.serviceAccounts


	// Components
	import ServiceAccountsTable from './ServiceAccountsTable.svelte'
</script>


<section class="column">
	<header class="row">
		<h2>Service Accounts</h2>

		{#if serviceAccounts.length}
			<a
				class="button primary"
				href="/service-accounts/create"
			>Connect Service Account</a>
		{/if}
	</header>

	<ServiceAccountsTable
		{serviceAccounts}
	/>
</section>
