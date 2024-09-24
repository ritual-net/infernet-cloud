<script lang="ts">
	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	$: ({
		nodeWithInfo: {
			node,
		},
		container,
	} = $page.data as PageData)


	// Components
	import RitualLogo from '$/icons/RitualLogo.svelte'
	import ContainerConfigDetails from '../../../../ContainerConfigDetails.svelte'
</script>


<svelte:head>
	<title>{container.container_id} | Container | Infernet Cloud</title>
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
					{container.container_id}
				</h2>

				<p>Container</p>
			</div>
		</div>
	</header>

	<section class="column">
		<h3>Configuration</h3>

		<ContainerConfigDetails
			chainId={node.chain_id ?? undefined}
			container={container}
		/>
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
