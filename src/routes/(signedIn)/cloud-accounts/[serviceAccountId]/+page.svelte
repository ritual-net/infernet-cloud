<script lang="ts">
	// Types/constants
	import { providers } from '$/types/provider'


	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	$: ({
		serviceAccount,
	} = $page.data as PageData)


	// Functions
	import { resolveRoute } from '$app/paths'


	// Components
	// import ClustersTable from '$/routes/clusters/ClustersTable.svelte'
	import RitualLogo from '$/icons/RitualLogo.svelte'
</script>


<div class="container column">
	<header class="row wrap">
		<div class="row">
			<div
				class="icon"
			>
				<RitualLogo />
			</div>

			<div class="column inline">
				<h2>
					{serviceAccount.name || serviceAccount.id}
				</h2>

				<p>Cloud Account</p>
			</div>
		</div>

		<!-- <a
			href={resolveRoute(`/serviceAccounts/[serviceAccountId]/edit`, {
				serviceAccountId: $page.params.serviceAccountId,
			})}
			class="button primary"
		>Edit Account</a> -->
	</header>

	<section class="column">
		<h3>Details</h3>

		<dl class="card column">
			<section class="row wrap">
				<dt>Cloud Provider</dt>

				<dd class="row">
					<img
						class="icon"
						src={providers[serviceAccount.provider].icon}
					/>
					{providers[serviceAccount.provider].name}
				</dd>
			</section>

			<section class="row wrap">
				<dt>User</dt>

				<dd>
					{serviceAccount.user.name}
				</dd>
			</section>

			<!-- <section class="row wrap">
				<dt>Credentials</dt>

				<dd>
					<pre>{JSON.stringify(serviceAccount.creds, null, '\t')}</pre>
				</dd>
			</section> -->
		</dl>
	</section>

	<!-- <div>
		<h3>Clusters</h3>

		<ClustersTable
			clusters={[]}
		/>
	</div> -->
</div>


<style>
	.container {
		gap: 2rem;
	}

	.icon {
		width: 1.5em;
		height: 1.5em;
	}

	header .icon {
		flex-shrink: 0;
		width: 4em;
		height: 4em;
		border-radius: 0.25em;
		padding: 0.5em;

		background-color: var(--color-ritualBlack);
		color: #fff;
	}
</style>
