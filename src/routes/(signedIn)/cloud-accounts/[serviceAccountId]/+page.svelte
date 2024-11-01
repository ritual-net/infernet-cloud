<script lang="ts">
	// Types/constants
	import { providers } from '$/types/provider'


	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	$: ({
		serviceAccount,
		clusters: clustersPromise,
	} = $page.data as PageData)

	let clusters: Awaited<typeof clustersPromise> | undefined
	$: clustersPromise?.then(_ => { clusters = _ })


	// Actions
	import { addToast, removeToast } from '$/components/Toaster.svelte'
	import { applyAction } from '$app/forms'


	// Components
	import ClustersTable from '$/routes/(signedIn)/clusters/ClustersTable.svelte'
	import DropdownMenu from '$/components/DropdownMenu.svelte'
	import WithIcon from '$/components/WithIcon.svelte'
	import RitualLogo from '$/icons/RitualLogo.svelte'
</script>


<svelte:head>
	<title>{serviceAccount.name || serviceAccount.id} | Cloud Account | Infernet Cloud</title>
</svelte:head>


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

				<p>Cloud account</p>
			</div>
		</div>

		<!-- <a
			href={resolveRoute(`/serviceAccounts/[serviceAccountId]/edit`, {
				serviceAccountId: $page.params.serviceAccountId,
			})}
			class="button primary"
		>Edit account</a> -->

		<DropdownMenu
			labelText="Service account actions"
			items={[
				{
					value: 'delete',
					label: 'Disconnect',
					isDestructive: true,
					formAction: `?/delete`,
					formSubmit: async (e) => {
						const toast = addToast({
							closeDelay: 0,
							data: {
								type: 'loading',
								title: `Disconnecting "${serviceAccount.name}"...`,
							},
						})

						return async ({ result }) => {
							await applyAction(result)

							removeToast(toast.id)
						}
					},
				},
			]}
		/>
	</header>

	<section class="column">
		<h3>Configuration</h3>

		<dl class="card column">
			<section class="row wrap">
				<dt>Cloud provider</dt>

				<dd class="row">
					<WithIcon
						icon={providers[serviceAccount.provider].icon}
					>
						{providers[serviceAccount.provider].name}
					</WithIcon>
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

	<section class="column">
		<header class="row">
			<h3>Clusters</h3>

			<a
				class="button primary"
				href={`/clusters/create?${new URLSearchParams({
					serviceAccountId: serviceAccount.id,
				})}`}
			>
				Create cluster
			</a>
		</header>

		<ClustersTable
			clusters={clusters ?? []}
		>
			{#await clusters}
				Loading clusters...
			{:then}
				No clusters found.
			{/await}
		</ClustersTable>
	</section>
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

		background-color: light-dark(#000, #fff);
		color: light-dark(#fff, #000);
	}
</style>
