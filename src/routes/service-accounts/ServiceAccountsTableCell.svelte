<script context="module" lang="ts">
	export enum CellType {
		CloudProvider,
	}
</script>


<script lang="ts">
	// Types/constants
	import { providers } from '$types/provider'
	import type { QueriedServiceAccount } from '../api/service_account/+server'


	// Inputs
	export let serviceAccount: QueriedServiceAccount
	export let cellType: CellType
</script>


{#if cellType === CellType.CloudProvider}
	<div class="row">
		<img src={providers[serviceAccount.provider].icon} />
		{providers[serviceAccount.provider].name}
	</div>
{:else}

{/if}


<style>
	img {
		width: 1.5em;
		height: 1.5em;
	}
</style>
