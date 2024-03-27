<script lang="ts">
	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	$: ({
		node
	} = $page.data as PageData)


	// Actions
	import { enhance } from '$app/forms'


	// Components
	// import NodesContainersTable from './NodesContainersTable.svelte'
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
					{node.id}
				</h2>

				<p>Infernet Node</p>
				<!-- <p>Created {node.created}</p> -->
			</div>
		</div>

		<div class="row">
			<dl class="card inline">
				<div class="row">
					<dt>Status</dt>
					<dd>
						<div
							class="status"
							data-status={node.status}
						>{node.status}</div>
					</dd>
				</div>
			</dl>

			<form
				method="POST"
				action="/?start"
			>
				<button type="submit">Start Node</button>
			</form>
		</div>
	</header>

	<section class="column">
		<h3>Details</h3>

		<dl class="card column">
			<section class="row">
				<dt>IP</dt>

				<dd>
					{node.ip}
				</dd>
			</section>
		</dl>
	</section>

	<!-- <div>
		<h3>Containers</h3>

		<NodesContainersTable
			nodes={node.containers}
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
		width: 4em;
		height: 4em;
		border-radius: 0.25em;
		padding: 0.5em;

		background-color: var(--color-ritualBlack);
		color: #fff;
	}

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

		&:before {
			content: '⏺';
			margin-right: 0.33em;
			color: var(--status-color)
		}
	}
</style>
