<script lang="ts">
	// Context
	import { page } from '$app/stores'

	$: ({
		serviceAccountsPromise,
		dockerAccountsPromise,
	} = $page.data)


	// Components
	import ServiceAccountsTable from './ServiceAccountsTable.svelte'
	import DockerAccountsTable from './DockerAccountsTable.svelte'
</script>


<svelte:head>
	<title>Cloud Accounts | Infernet Cloud</title>
</svelte:head>


<section class="column">
	<header class="row">
		<h2>Cloud accounts</h2>

		<a
			class="button primary"
			href="/cloud-accounts/connect"
		>Connect cloud account</a>
	</header>

	<ServiceAccountsTable
		serviceAccounts={serviceAccountsPromise}
	/>
</section>

<hr>

<section class="column">
	<header class="row">
		<h2>Docker accounts</h2>

		<a
			class="button primary"
			href="/cloud-accounts/docker/connect"
		>Connect Docker account</a>
	</header>

	<DockerAccountsTable
		dockerAccounts={dockerAccountsPromise}
	/>
</section>
