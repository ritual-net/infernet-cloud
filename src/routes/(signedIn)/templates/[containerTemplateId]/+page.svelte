<script lang="ts">
	// Types/constants
	import { chainsByChainId } from '$/lib/chains'


	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	$: ({
		containerTemplate,
	} = $page.data as PageData)


	// Actions
	import { applyAction } from '$app/forms'
	import { goto, invalidate } from '$app/navigation'
	import { addToast, removeToast } from '$/components/Toaster.svelte'


	// Components
	import RitualLogo from '$/icons/RitualLogo.svelte'
	import DropdownMenu from '$/components/DropdownMenu.svelte'
	import WithIcon from '$/components/WithIcon.svelte'
	import ContainerConfigDetails from '../../ContainerConfigDetails.svelte'
	import { DockerIcon } from '$/icons'
</script>


<svelte:head>
	<title>{containerTemplate.name} | Container Template | Infernet Cloud</title>
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
					{containerTemplate.name}
				</h2>

				<p>Container template</p>
			</div>
		</div>

		<div class="row">
			<DropdownMenu
				labelText="Container Template actions"
				items={[
					{
						value: 'duplicate',
						label: 'Duplicate container template',
						onClick: () => {
							goto(`/templates/create?fromContainerTemplate=${containerTemplate.id}`)
						},
					},
					{
						value: 'delete',
						label: 'Delete container template',
						isDestructive: true,
						formAction: `?/delete`,
						formSubmit: async (e) => {
							const toast = addToast({
								closeDelay: 0,
								data: {
									type: 'loading',
									title: `Deleting container template "${containerTemplate.name}"...`,
								},
							})
		
							return async ({ result }) => {
								await applyAction(result)
		
								if(result.type === 'success')
									invalidate(`/api/container_template`)
		
								removeToast(toast.id)
							}
						},
					},
				]}
			/>
		</div>
	</header>

	<section class="column">
		<h3>Node details</h3>

		<dl class="card column">
			<section class="row wrap">
				<dt>Onchain?</dt>

				<dd>
					{containerTemplate.chain_enabled ? 'Yes' : 'No'}
				</dd>
			</section>

			{#if containerTemplate.chain_enabled && containerTemplate.chain_id}
				<section class="row">
					<dt>Chain</dt>

					<dd class="row">
						{#if containerTemplate.chain_id && chainsByChainId.has(containerTemplate.chain_id)}
							{@const chain = chainsByChainId.get(containerTemplate.chain_id)}

							<span class="row inline with-icon">
								<img
									src={chain.icon}
									alt={chain.name}
									class="icon"
								/>
								{chain.name}
							</span>
						{:else}
							{containerTemplate.chain_id ?? '–'}
						{/if}
					</dd>
				</section>
			{/if}

			{#if containerTemplate.docker_account}
				<section class="row wrap">
					<dt>Docker Hub account</dt>

					<dd>
						<WithIcon
							icon={DockerIcon}
						>
							{containerTemplate.docker_account.username}
						</WithIcon>
					</dd>
				</section>
			{/if}
		</dl>
	</section>

	<section class="column">
		<h3>Configuration</h3>

		<ContainerConfigDetails
			chainId={containerTemplate.chain_id}
			container={containerTemplate}
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
