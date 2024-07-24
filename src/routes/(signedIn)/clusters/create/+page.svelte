<script lang="ts">
	// Types/constants
	import { providers } from '$/types/provider'

	enum Fieldset {
		CreateCluster,
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
	let hasFirewall = (
		Boolean($form.config.ip_allow_http?.length || $form.config.ip_allow_ssh?.length)
	)
	let ip_allow_http = $form.config.ip_allow_http ?? []
	let ip_allow_ssh = $form.config.ip_allow_ssh ?? []

	$: $form.config.ip_allow_http = hasFirewall ? ip_allow_http : []
	$: $form.config.ip_allow_ssh = hasFirewall ? ip_allow_ssh : []


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


<form
	method="POST"
	use:enhance
>
	<Tabs
		bind:value={currentFieldset}
		items={[
			{
				id: Fieldset.CreateCluster,
				label: 'Create a Cluster',
			},
			{
				id: Fieldset.AddNodes,
				label: 'Add Nodes',
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
										Cloud Account
									</label>
								</h3>

								<p></p>
							</div>

							<Select
								required
								id="serviceAccountId"
								name="serviceAccountId"
								labelText="Cloud Account"
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

						<Collapsible open={serviceAccount?.provider}>
							<fieldset
								class="column"
								disabled={!(serviceAccount?.provider)}
							>
								<section class="column wrap">
									<div class="row wrap">
										<div class="column inline">
											<h3 class="row inline">
												<label for="hasFirewall">
													Firewall
												</label>
											</h3>

											<p>Determine which IP addresses will have permissions to this cluster.</p>
										</div>

										<Select
											required
											id="hasFirewall"
											name="hasFirewall"
											labelText="Firewall"
											bind:value={hasFirewall}
											items={[
												{
													value: false,
													label: 'All IPs',
												},
												{
													value: true,
													label: 'Only allowed IPs',
												}
											]}
										/>
									</div>

									{#if hasFirewall}
										<Tabs
											value={0}
											items={[
												{
													id: 0,
													label: 'HTTP',
												},
												{
													id: 1,
													label: 'SSH',
												},
											]}
										>
											<svelte:fragment slot="content"
												let:item
											>
												{#if item.id === 0}
													<Textarea
														id="config.ip_allow_http"
														name="config.ip_allow_http"
														rows="2"
														placeholder={`Enter a comma-separated list of IP addresses...\n0.0.0.0/1, 0.0.0.0/2`}
														value={serializeCommaSeparated(ip_allow_http)}
														onblur={e => { ip_allow_http = parseCommaSeparated(e.currentTarget.value) }}
														{...$constraints.config?.ip_allow_http}
														pattern={$constraints?.config?.ip_allow_http?.pattern && `^${$constraints.config.ip_allow_http.pattern.replaceAll(/^[^]|[$]$/g, '')}(?:, ${$constraints.config.ip_allow_http.pattern.replaceAll(/^[^]|[$]$/g, '')})*$`}
														disabled={!hasFirewall}
													/>

												{:else}
													<Textarea
														id="config.ip_allow_ssh"
														name="config.ip_allow_ssh"
														rows="2"
														placeholder={`Enter a comma-separated list of IP addresses...\n0.0.0.0/1, 0.0.0.0/2`}
														value={serializeCommaSeparated(ip_allow_ssh)}
														onblur={e => { ip_allow_ssh = parseCommaSeparated(e.currentTarget.value) }}
														{...$constraints.config?.ip_allow_ssh}
														pattern={$constraints?.config?.ip_allow_ssh?.pattern && `^${$constraints.config.ip_allow_ssh.pattern.replaceAll(/^[^]|[$]$/g, '')}(?:, ${$constraints.config.ip_allow_ssh.pattern.replaceAll(/^[^]|[$]$/g, '')})*$`}
														disabled={!hasFirewall}
													/>
												{/if}
											</svelte:fragment>
										</Tabs>
									{/if}
								</section>

								<RegionZoneMachineFields
									{serviceAccount}
									bind:regionId={$form.config.region}
									bind:zoneId={$form.config.zone}
									bind:machineId={$form.config.machine_type}
									constraints={{
										region: $constraints.config?.region,
										zone: $constraints.config?.zone,
										machine_type: $constraints.config?.machine_type,
									}}
								/>
							</fieldset>
						</Collapsible>
					</div>

					<div class="card column">
						<Collapsible>
							<svelte:fragment slot="trigger">
								<header>
									<!-- {providers[$form.serviceAccountId]} -->
									<!-- Google Cloud -->

									Advanced
								</header>
							</svelte:fragment>

							<section class="row wrap">
								<div class="column inline">
									<h3>
										<label for="config.deploy_router">
											Deploy Router?
										</label>
									</h3>

									<p>Determine whether your cluster will be deployed with a router.</p>
								</div>

								<Switch
									id="config.deploy_router"
									name="config.deploy_router"
									bind:checked={$form.config.deploy_router}
									labelText="Deploy Router?"
								/>
							</section>
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

				{:else if item.id === Fieldset.AddNodes}
					{#each $form.nodes as node, i (node.id)}
						<article
							class="card column"
							transition:scale={{ start: 0.8 }}
							animate:flip={{ duration: 300 }}
						>
							<header class="row">
								<h3 class="annotation">
									Node #{i + 1}
								</h3>
						
								{#if $form.nodes.length > 1}
									<button
										type="button"
										class="small"
										on:click={() => {
											$form.nodes = $form.nodes.toSpliced(i, 1)
										}}
										transition:scale
									>
										Delete
									</button>
								{/if}
							</header>

							<NodeFormFields
								bind:node
								namePrefix="nodes.{i}"
								constraints={$constraints.nodes}
								{dockerAccounts}
							/>
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
								Add Node
							</button>

							<FormSubmitButton
								submitting={$submitting}
								allErrors={$allErrors}
								submitLabel="Create Cluster"
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
	}

	.icon {
		width: 1.5em;
		height: 1.5em;
	}
</style>
