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
			transition: color 0.3s;

			content: '⏺';
			margin-right: 0.33em;
			color: var(--status-color);
		}
	}
</style>
