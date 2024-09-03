<script lang="ts">
	// Types/constants
	import { providers } from '$/types/provider'

	enum Fieldset {
		CreateCluster,
		ConfigureRouter,
		AddNodes,
	}


	// Schema
	import { Node, FormData } from './schema'


	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	const {
		formData,
		serviceAccounts,
		imagesPromise,
		dockerAccounts,
	} = $page.data as PageData


	// Functions
	import { parseCommaSeparated, serializeCommaSeparated } from '$/lib/utils/commaSeparated'


	// Actions
	import { type Toast, addToast, removeToast } from '$/components/Toaster.svelte'


	// Internal state
	// (Form)
	import { superForm } from 'sveltekit-superforms/client'
	import { yupClient } from 'sveltekit-superforms/adapters'

	const {
		form,
		enhance,
		errors,
		allErrors,
		constraints,

		capture,
		restore,

		submitting,
		delayed,
	} = superForm(formData, {
		dataType: 'json',
		customValidity: true,
		validators: yupClient(FormData),
	})

	export const snapshot = { capture, restore }

	let delayedToast: Toast
	$: if($delayed){
		delayedToast = addToast({
			data: {
				type: 'default',
				title: `Creating cluster...`,
				description: `This may take several minutes.`,
			},
		})
	}else{
		if(delayedToast)
			removeToast(delayedToast.id)
	}

	// (UI state)
	let currentFieldset = Fieldset.CreateCluster


	// (Firewall)
	let httpFirewallMode: 'all' | 'allowlist' | 'none' = (
		!$form.config.ip_allow_http || $form.config.ip_allow_http.length === 1 && $form.config.ip_allow_http[0] === '0.0.0.0/0' ?
			'all'
		: $form.config.ip_allow_http.length > 0 ?
			'allowlist'
		:
			'none'
	)
	let sshFirewallMode: 'all' | 'allowlist' | 'none' = (
		!$form.config.ip_allow_ssh || $form.config.ip_allow_ssh.length === 1 && $form.config.ip_allow_ssh[0] === '0.0.0.0/0' ?
			'all'
		: $form.config.ip_allow_ssh.length > 0 ?
			'allowlist'
		:
			'none'
	)

	let httpAllowlist = $form.config.ip_allow_http ?? []
	let sshAllowlist = $form.config.ip_allow_ssh ?? []

	$: $form.config.ip_allow_http = (
		httpFirewallMode === 'all' ?
			undefined
		: httpFirewallMode === 'allowlist' ?
			httpAllowlist
		: httpFirewallMode === 'none' ?
			[]
		:
			undefined
	)
	$: $form.config.ip_allow_ssh = (
		sshFirewallMode === 'all' ?
			undefined
		: sshFirewallMode === 'allowlist' ?
			sshAllowlist
		: sshFirewallMode === 'none' ?
			[]
		:
			undefined
	)


	// (Service account)
	$: serviceAccount = serviceAccounts.find(serviceAccount => serviceAccount.id === $form.serviceAccountId)


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import FormSubmitButton from '$/components/FormSubmitButton.svelte'
	import Switch from '$/components/Switch.svelte'
	import Select from '$/components/Select.svelte'
	import Tabs from '$/components/Tabs.svelte'
	import Textarea from '$/components/Textarea.svelte'
	import NodeFormFields from './NodeFormFields.svelte'
	import RegionZoneMachineFields from './RegionZoneMachineFields.svelte'


	// Transitions/animations
	import { fly, scale } from 'svelte/transition'
	import { flip } from 'svelte/animate'
</script>


<svelte:head>
	<title>Create Cluster | Infernet Cloud</title>
</svelte:head>


<form
	method="POST"
	use:enhance
>
	<Tabs
		bind:value={currentFieldset}
		items={[
			{
				id: Fieldset.CreateCluster,
				label: 'Create a cluster',
			},
			{
				id: Fieldset.ConfigureRouter,
				label: 'Configure router',
			},
			{
				id: Fieldset.AddNodes,
				label: 'Add nodes',
			},
		]}
		layout="tooltip-dots"
	>
		<svelte:fragment slot="content"
			let:item
		>
			<fieldset
				class="column"
				in:fly={{ x: 40, duration: 200 }}
				out:fly={{ x: -40, duration: 200 }}
			>
				<header class="row">
					<legend>
						<h2>{item.label}</h2>
					</legend>
				</header>

				{#if item.id === Fieldset.CreateCluster}
					<div class="card column">
						<section class="row wrap">
							<div class="column inline">
								<h3>
									<label for="serviceAccountId">
										Cloud account
									</label>
								</h3>

								<p></p>
							</div>

							<Select
								required
								id="serviceAccountId"
								name="serviceAccountId"
								labelText="Cloud account"
								bind:value={$form.serviceAccountId}
								items={serviceAccounts.map(serviceAccount => ({
									icon: providers[serviceAccount.provider].icon,
									value: serviceAccount.id,
									label: serviceAccount.name,
								}))}
							/>
						</section>

						<section class="row wrap">
							<div class="column inline">
								<h3 class="row inline">
									<label for="config.name">
										Cluster name
									</label>
								</h3>

								<p>Give your cluster a human-readable name.</p>
							</div>

							<input
								type="text"
								id="config.name"
								name="config.name"
								placeholder="my-cluster-1"
								bind:value={$form.config.name}
								{...$constraints.config?.name}
							/>
						</section>

						<section class="column wrap">
							<h3>Firewall</h3>
							
							<div class="row equal align-start wrap">
								<div class="column">
									<div class="column inline">
										<h4>
											<label for="hasHttpFirewall">
												HTTP
											</label>
										</h4>

										<p>Specify which IPs can make HTTP requests to this cluster.</p>
									</div>

									<Select
										required
										id="hasHttpFirewall"
										name="hasHttpFirewall"
										labelText="HTTP Firewall"
										bind:value={httpFirewallMode}
										items={[
											{
												value: 'all',
												label: 'All IPs',
											},
											{
												value: 'allowlist',
												label: 'Only allowed IPs',
											},
											{
												value: 'none',
												label: 'None (disabled)',
											}
										]}
									/>

									{#if httpFirewallMode === 'allowlist'}
										<Textarea
											id="config.ip_allow_http"
											name="config.ip_allow_http"
											rows="2"
											placeholder={`Comma-separated IPv4 addresses / CIDR blocks...\n0.0.0.0/1, 0.0.0.0/2`}
											value={serializeCommaSeparated(httpAllowlist)}
											onblur={e => { httpAllowlist = parseCommaSeparated(e.currentTarget.value) }}
											{...$constraints.config?.ip_allow_http}
											pattern={$constraints?.config?.ip_allow_http?.pattern && `^${$constraints.config.ip_allow_http.pattern.replaceAll(/^[^]|[$]$/g, '')}(?:, ${$constraints.config.ip_allow_http.pattern.replaceAll(/^[^]|[$]$/g, '')})*$`}
											class="small"
										/>
									{/if}
								</div>

								<div class="column">
									<div class="column inline">
										<h4>
											<label for="hasSshFirewall">
												SSH
											</label>
										</h4>

										<p>Specify which IPs can connect to this cluster via SSH.</p>
									</div>

									<Select
										required
										id="hasSshFirewall"
										name="hasSshFirewall"
										labelText="SSH Firewall"
										bind:value={sshFirewallMode}
										items={[
											{
												value: 'all',
												label: 'All IPs',
											},
											{
												value: 'allowlist',
												label: 'Only allowed IPs',
											},
											{
												value: 'none',
												label: 'None (disabled)',
											},
										]}
									/>

									{#if sshFirewallMode === 'allowlist'}
										<Textarea
											id="config.ip_allow_ssh"
											name="config.ip_allow_ssh"
											rows="2"
											placeholder={`Comma-separated IPv4 addresses / CIDR blocks...\n0.0.0.0/1, 0.0.0.0/2`}
											value={serializeCommaSeparated(sshAllowlist)}
											onblur={e => { sshAllowlist = parseCommaSeparated(e.currentTarget.value) }}
											{...$constraints.config?.ip_allow_ssh}
											pattern={$constraints?.config?.ip_allow_ssh?.pattern && `^${$constraints.config.ip_allow_ssh.pattern.replaceAll(/^[^]|[$]$/g, '')}(?:, ${$constraints.config.ip_allow_ssh.pattern.replaceAll(/^[^]|[$]$/g, '')})*$`}
											class="small"
										/>
									{/if}
								</div>
							</div>
						</section>

						<Collapsible open={serviceAccount?.provider}>
							<fieldset
								class="column"
								disabled={!(serviceAccount?.provider)}
							>
								<RegionZoneMachineFields
									entityType="cluster"
									namePrefix="config"
									{serviceAccount}
									bind:regionId={$form.config.region}
									bind:zoneId={$form.config.zone}
									constraints={{
										region: $constraints.config?.region,
										zone: $constraints.config?.zone,
									}}
								/>
							</fieldset>
						</Collapsible>
					</div>

					<footer class="row">
						<a
							class="button"
							href="/clusters"
						>
							Cancel
						</a>

						<button
							type="button"
							class="primary"
							on:click={() => currentFieldset++}
						>
							Continue
						</button>
					</footer>

				{:else if item.id === Fieldset.ConfigureRouter}
					<div class="card column">
						<section class="row">
							<div class="column inline">
								<h3>
									<label for="config.deploy_router">
										Deploy Router?
									</label>
								</h3>

								<p>Specify whether your cluster will be deployed with an <a href="https://docs.ritual.net/infernet/router/introduction" target="_blank">Infernet Router</a>.</p>
							</div>

							<Switch
								id="config.deploy_router"
								name="config.deploy_router"
								bind:checked={$form.config.deploy_router}
								labelText="Deploy Router?"
							/>
						</section>

						<Collapsible
							open={$form.config.deploy_router}
						>	
							<RegionZoneMachineFields
								entityType="router"
								namePrefix="router"
								{serviceAccount}
								defaults={{
									region: $form.config.region,
									zone: $form.config.zone,
								}}
								bind:regionId={$form.router.region}
								bind:zoneId={$form.router.zone}
								bind:machineId={$form.router.machine_type}
								bind:machineImageId={$form.router.machine_image}
								constraints={$constraints.router}
							/>
						</Collapsible>
					</div>

					<footer class="row">
						<button
							type="button"
							on:click={() => currentFieldset--}
						>
							Back
						</button>

						<button
							type="button"
							class="primary"
							on:click={() => currentFieldset++}
						>
							Continue
						</button>
					</footer>

				{:else if item.id === Fieldset.AddNodes}
					{#each $form.nodes as node, i (node.id)}
						<article
							class="card column"
							transition:scale={{ start: 0.8 }}
							animate:flip={{ duration: 300 }}
						>
							<Collapsible
								open
							>
								<svelte:fragment slot="trigger" let:open>
									<header
										class="row"
										data-after={open ? '▴' : '▾'}
									>
										<h3 class="annotation">
											Node #{i + 1}
										</h3>
								
										{#if $form.nodes.length > 1}
											<button
												type="button"
												class="small destructive"
												on:click={() => {
													$form.nodes = $form.nodes.toSpliced(i, 1)
												}}
												transition:scale
											>
												Delete
											</button>
										{/if}
									</header>
								</svelte:fragment>

								<NodeFormFields
									defaultRegionId={$form.config.region}
									defaultZoneId={$form.config.zone}
									bind:node
									namePrefix="nodes.{i}"
									constraints={$constraints.nodes}
									{serviceAccount}
									{dockerAccounts}
								/>
							</Collapsible>
						</article>
					{/each}

					<footer class="row">
						<button type="button"
							on:click={() => currentFieldset--}
						>
							Back
						</button>
				
						<div class="row">
							<button
								type="button"
								on:click={() => $form.nodes = [...$form.nodes, Node.getDefault()]}
							>
								Add node
							</button>

							<FormSubmitButton
								submitting={$submitting}
								allErrors={$allErrors}
								submitLabel="Create cluster"
							/>
						</div>
					</footer>
				{/if}
			</fieldset>
		</svelte:fragment>
	</Tabs>
</form>


<style>
	.loading-status {
		position: relative;
		place-self: center;
		cursor: progress;
	}

	.icon {
		width: 1.5em;
		height: 1.5em;
	}
</style>
