<script lang="ts">
	// Constants
	const statusLabels = {
		'healthy': 'Healthy',
		'updating': 'Updating',
		'unhealthy': 'Unhealthy',
		'unknown': 'Unknown',
	}


	// Inputs
	export let status: keyof typeof statusLabels
</script>


<div
	class="status"
	data-status={status}
>
	{statusLabels[status]}
</div>


<style>
	.status {
		&[data-status="healthy"] {
			--status-color: #16B371;
		}

		&[data-status="updating"] {
			--status-color: #b3a316;
		}

		&[data-status="unhealthy"] {
			--status-color: #b33d16;
		}

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
