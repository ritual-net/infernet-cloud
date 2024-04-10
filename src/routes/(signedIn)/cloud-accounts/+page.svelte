<script lang="ts">
	// Context
	import { page } from '$app/stores'

	$: ({
		serviceAccounts,
		dockerAccounts,
	} = $page.data)


	// Components
	import ServiceAccountsTable from './ServiceAccountsTable.svelte'
	import DockerAccountsTable from './DockerAccountsTable.svelte'
</script>


<section class="column">
	<header class="row">
		<h2>Cloud Accounts</h2>

		<a
			class="button primary"
			href="/cloud-accounts/connect"
		>Connect Cloud Account</a>
	</header>

	<ServiceAccountsTable
		{serviceAccounts}
	/>
</section>

<section class="column">
	<header class="row">
		<h2>Docker Accounts</h2>

		<a
			class="button primary"
			href="/cloud-accounts/docker/connect"
		>Connect Docker Account</a>
	</header>

	<DockerAccountsTable
		{dockerAccounts}
	/>
</section>
