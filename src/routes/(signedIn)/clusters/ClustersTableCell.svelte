<script context="module" lang="ts">
	export enum CellType {
		ServiceAccount,
		Status,
	}
</script>

<script lang="ts">
	// Types/constants
	import { providers } from '$/types/provider';
	import type { getClustersForUser } from '$/lib/db/queries';

	// Inputs
	export let cluster: Awaited<ReturnType<typeof getClustersForUser>>[number];
	export let cellType: CellType;
</script>

{#if cellType === CellType.ServiceAccount}
	<div class="row">
		<img src={providers[cluster.service_account.provider].icon} />
		{cluster.service_account.name}
	</div>
{:else if cellType === CellType.Status}
	{@const clusterStatus = cluster.locked ? 'updating' : cluster.healthy ? 'healthy' : 'unhealthy'}

	<div class="status" data-status={clusterStatus}>
		{{
			healthy: 'Healthy',
			updating: 'Updating',
			unhealthy: 'Unhealthy',
		}[clusterStatus]}
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

	.status {
		&[data-status='healthy'] {
			--status-color: #16b371;
		}

		&[data-status='updating'] {
			--status-color: #b3a316;
		}

		&[data-status='unhealthy'] {
			--status-color: #b33d16;
		}

		&:before {
			content: '⏺';
			margin-right: 0.33em;
			color: var(--status-color);
		}
	}
</style>
