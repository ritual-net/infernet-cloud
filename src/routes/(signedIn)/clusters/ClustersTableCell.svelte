<script context="module" lang="ts">
	export enum CellType {
		ServiceAccount,
		Status,
	}
</script>


<script lang="ts">
	// Types/constants
	import { providers } from '$/types/provider'
	import type { getClustersForUser } from '$/lib/db/queries'


	// Functions
	const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
	})


	// Inputs
	export let cluster: Awaited<ReturnType<typeof getClustersForUser>>[number]
	export let cellType: CellType


	// Components
	import WithIcon from '$/components/WithIcon.svelte'
	import Status from '$/views/Status.svelte'
</script>


{#if cellType === CellType.ServiceAccount}
	<WithIcon
		icon={providers[cluster.service_account.provider].icon}
		alt={cluster.service_account.name}
	>
		<div>
			{cluster.service_account.name}

			<p class="annotation">
				{cluster.region}
				/
				{cluster.zone}
			</p>
		</div>
	</WithIcon>

{:else if cellType === CellType.Status}
	<div class="column inline">
		<Status
			status={cluster.status}
		/>

		{#if cluster.latest_deployment}
			<date>{dateTimeFormat.format(new Date(cluster.latest_deployment.timestamp))}</date>
		{/if}
	</div>
{/if}


<style>
	.row {
		justify-content: start;
	}

	img {
		width: 1.5em;
		height: 1.5em;
	}
</style>
