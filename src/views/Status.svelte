<script lang="ts">
	// Constants
	const statusLabels = {
		'healthy': 'Healthy',
		'updating': 'Updating',
		'unhealthy': 'Unhealthy',
		'destroyed': 'Destroyed',
		'failed': 'Failed',
		'succeeded': 'Succeeded',
		'unknown': 'Unknown',
		'pending': 'Pending',
		'provisioning': 'Provisioning',
		'staging': 'Staging',
		'running': 'Running',
		'stopping': 'Stopping',
		'stopped': 'Stopped',
		'terminated': 'Stopped',
		'shutting-down': 'Shutting down',
		'undeployed': 'Undeployed',
	}


	// Inputs
	export let status: keyof typeof statusLabels | undefined
</script>


<div
	class="status"
	data-status={status ?? 'loading'}
>
	{status ? (statusLabels[status] ?? status) : 'Loading'}
</div>


<style>
	.status {
		&[data-status="succeeded"],
		&[data-status="healthy"],
		&[data-status="running"] {
			--status-color: #16B371;
		}

		&[data-status="updating"],
		&[data-status="pending"],
		&[data-status="provisioning"],
		&[data-status="staging"],
		&[data-status="stopping"],
		&[data-status="shutting-down"] {
			--status-color: #b3a316;

			&:before {
				animation: Loading 0.75s infinite alternate both ease-in-out;
			}
		}

		&[data-status="failed"],
		&[data-status="unhealthy"] {
			--status-color: #b33d16;
		}

		&[data-status="stopped"],
		&[data-status="terminated"],
		&[data-status="destroyed"],
		&[data-status="undeployed"],
		&[data-status="unknown"] {
			--status-color: gray;
		}

		&[data-status="loading"] {
			--status-color: gray;
			color: color-mix(in oklch, transparent, currentColor 50%);
		}

		&:before {
			transition: background-color 0.3s;

			content: '';
			display: inline-flex;
			margin-right: 0.33em;
			width: 0.55em;
			height: 0.55em;
			border-radius: 50%;
			vertical-align: 0.05em;
			background-color: var(--status-color);
		}

		&[data-status="loading"]:before {
			animation: Loading 0.75s infinite alternate both ease-in-out;
		}
	}

	@keyframes Loading {
		from, 10% { 
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
</style>
