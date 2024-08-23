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
		'TERMINATED': 'Terminated',
	}


	// Inputs
	export let status: keyof typeof statusLabels
</script>


<div
	class="status"
	data-status={status}
>
	{statusLabels[status] ?? status ?? 'Unknown'}
</div>


<style>
	.status {
		&[data-status="succeeded"],
		&[data-status="healthy"] {
			--status-color: #16B371;
		}

		&[data-status="updating"] {
			--status-color: #b3a316;
		}

		&[data-status="failed"],
		&[data-status="unhealthy"],
		&[data-status="terminated"] {
			--status-color: #b33d16;
		}

		&[data-status="destroyed"],
		&[data-status="unknown"] {
			--status-color: gray;
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
	}
</style>
