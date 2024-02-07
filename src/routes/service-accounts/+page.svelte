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
			<a href="/service-accounts/create">
				<button class="primary">
					Connect Service Account
				</button>
			</a>
		{/if}
	</header>

	{#if serviceAccounts.length}
		<ServiceAccountsTable
			{serviceAccounts}
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
