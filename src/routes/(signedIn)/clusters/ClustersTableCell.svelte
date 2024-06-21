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
	
	
	// Inputs
	export let cluster: Awaited<ReturnType<typeof getClustersForUser>>[number]
	export let cellType: CellType


	// Components
	import Status from '$/views/Status.svelte'
</script>


{#if cellType === CellType.ServiceAccount}
	<div class="row">
		<img src={providers[cluster.service_account.provider].icon} />
		{cluster.service_account.name}
	</div>

{:else if cellType === CellType.Status}
	<Status
		status={cluster.status}
	/>
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
