<script lang="ts">
	// Types/constants
	import { providers } from '$types/provider'

	enum Fieldset {
		CreateCluster,
		AddNodes,
	}


	// Data
	import { Node } from './schema'


	// Context
	import type { PageData } from './$types'

	const {
		formData,
		serviceAccounts,
	} = $page.data as PageData


	// Internal state
	import { page } from '$app/stores'
	import { superForm } from 'sveltekit-superforms/client'

	const {
		form,
		enhance,
		errors,
		constraints,
		submitting,
	} = superForm(formData, {
		dataType: 'json',

		onResult: ({ result }) => {
			if(result.type === 'failure')
				alert(result.data?.result?.message)
		},
	})

	let currentFieldset = Fieldset.CreateCluster

	let allowIps: 'all' | 'restricted' = 'all'


	// Components
	import Collapsible from '$components/Collapsible.svelte'
	import Dialog from '$components/Dialog.svelte'
	import Switch from '$components/Switch.svelte'
	import Select from '$components/Select.svelte'
	import Tabs from '$components/Tabs.svelte'
	import NodeContainersTable from './NodeContainersTable.svelte'
	import ContainerForm from './container/+page.svelte'


	// Shallow Routes
	import { preloadData, goto, pushState } from '$app/navigation'


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
									<label for="serviceAccount">
										Service Account
									</label>
								</h3>

								<p></p>
							</div>

							<Select
								required
								name="serviceAccount"
								labelText="Service Account"
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
									<label for="cluster_name">
										Cluster name
									</label>
								</h3>

								<p>Give your cluster a human-readable name.</p>
							</div>

							<input
								type="text"
								name="cluster_name"
								placeholder="my-cluster-1"
								bind:value={$form.config.name}
								{...$constraints.config?.name}
							/>
						</section>

						<section class="column wrap">
							<div class="row wrap">
								<div class="column inline">
									<h3 class="row inline">
										<label for="coordinator_address">
											Firewall
										</label>
									</h3>

									<p>Determine which IP addresses will have permissions to this cluster.</p>
								</div>

								<Select
									required
									name="firewall"
									labelText="Firewall"
									bind:value={allowIps}
									items={[
										{
											value: 'all',
											label: 'All IPs',
										},
										{
											value: 'restricted',
											label: 'Only allowed IPs',
										}
									]}
								/>
							</div>

							{#if allowIps !== 'all'}
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
											<textarea
												name="credentials"
												rows="2"
												placeholder={`Enter a comma-separated list of IP addresses...\n0.0.0.0/1, 0.0.0.0/2`}
												bind:value={$form.config.ip_allow_http}
												{...$constraints.config?.ip_allow_http}
												disabled={allowIps === 'all'}
											/>

										{:else}
											<textarea
												name="credentials"
												rows="2"
												placeholder={`Enter a comma-separated list of IP addresses...\n0.0.0.0/1, 0.0.0.0/2`}
												bind:value={$form.config.ip_allow_ssh}
												{...$constraints.config?.ip_allow_ssh}
												disabled={allowIps === 'all'}
											/>
										{/if}
									</svelte:fragment>
								</Tabs>
							{/if}
						</section>

						<section class="row wrap">
							<div class="column inline">
								<h3>
									<label for="region">
										Region
									</label>
								</h3>

								<p>Select the region where your cluster should be deployed.</p>
							</div>

							<Select
								required
								name="region"
								labelText="Region"
								bind:value={$form.config.region}
								items={[
									{
										value: 'US-north-1',
										label: 'US-north-1',
									},
								]}
							/>
						</section>

						<!-- <section class="row wrap">
							<div class="column inline">
								<h3>
									<label for="zone">
										Zone
									</label>
								</h3>

								<p>Select the zone where your cluster should be deployed.</p>
							</div>

							<Select
								required
								name="zone"
								labelText="Zone"
								bind:value={$form.config.zone}
								items={[
									{
										value: 'US-north-1',
										label: 'US-north-1',
									},
								]}
							/>
						</section> -->

						<section class="row wrap">
							<div class="column inline">
								<h3>
									<label for="machine_type">
										Machine Type
									</label>
								</h3>

								<p>Select the type of machine you would like to deploy.</p>
							</div>

							<Select
								required
								name="machine_type"
								labelText="Machine Type"
								bind:value={$form.config.machine_type}
								items={[
									{
										value: 'e2-standard-2',
										label: 'e2-standard-2',
									},
								]}
							/>
						</section>
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

							<!-- <section class="column wrap">
								<div class="column inline">
									<h3>
										Docker Credentials
										<span class="annotation">Optional</span>
									</h3>

									<p>Sign into your Docker account for simple container management.</p>
								</div>

								<div class="row equal">
									<div class="column">
										<label for="username">Username</label>

										<input
											type="text"
											name="username"
											placeholder="Enter Docker username..."
											bind:value={$form.config.name}
											{...$constraints.config?.name}
										/>
									</div>

									<div class="column">
										<label for="access_token">Private Access Token</label>

										<input
											type="text"
											name="access_token"
											placeholder="Enter Docker access token..."
											bind:value={$form.config.name}
											{...$constraints.config?.name}
											class="code"
										/>
									</div>
								</div>
							</section> -->

							<section class="row wrap">
								<div class="column inline">
									<h3>
										<label for="deploy_router">
											Deploy Router?
										</label>
									</h3>

									<p>Determine whether your cluster will be deployed with a router.</p>
								</div>

								<Switch
									bind:checked={$form.config.deploy_router}
									labelText="Deploy Router?"
								/>
							</section>
						</Collapsible>
					</div>

					<footer class="row">
						<a href="/clusters">
							<button type="button">
								Cancel
							</button>
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
								<h3 class="annotation">Node #{i + 1}</h3>

								{#if $form.nodes.length > 1}
									<button
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

							<section class="row wrap">
								<div class="column inline">
									<h3>
										<label for="regchain_enabledion">
											Onchain?
										</label>
									</h3>

									<p>Determines if the node is listening to Ritual chain for events, or whether it is latent.</p>
								</div>

								<Switch
									bind:checked={node.chain_enabled}
									labelText="Onchain"
								/>
							</section>

							<Collapsible open={node.chain_enabled}>
								<fieldset disabled={!node.chain_enabled} class="column">
									<section class="row wrap">
										<div class="column inline">
											<h3>
												<label for="trail_head_blocks">
													Trail Head Blocks
												</label>
											</h3>

											<p>The number of blocks.</p>
										</div>

										<input
											type="number"
											bind:value={node.trail_head_blocks}
											{...$constraints.nodes?.trail_head_blocks ?? {}}
										/>
									</section>

									<section class="row wrap">
										<div class="column inline">
											<h3 class="row inline">
												<label for="rpc_url">
													RPC URL
												</label>
											</h3>

											<p>The Ethereum node RPC URL.</p>
										</div>

										<input
											type="url"
											bind:value={node.rpc_url}
											{...$constraints.nodes?.rpc_url ?? {}}
										/>
									</section>

									<section class="row wrap">
										<div class="column inline">
											<h3 class="row inline">
												<label for="coordinator_address">
													Coordinator Address
												</label>
											</h3>

											<p>The address of the Coordinator smart contract.</p>
										</div>

										<input
											type="text"
											bind:value={node.coordinator_address}
											{...$constraints.nodes?.coordinator_address ?? {}}
										/>
									</section>

									<section class="row wrap">
										<div class="column inline">
											<h3>
												<label for="max_gas_limit">
													Max Gas Limit
												</label>
											</h3>

											<p>The threshold to trigger an Ethereum transaction in gwei.</p>
										</div>

										<input
											type="number"
											bind:value={node.max_gas_limit}
											{...$constraints.nodes?.max_gas_limit ?? {}}
										/>
									</section>

									<section class="row wrap">
										<div class="column inline">
											<h3 class="row inline">
												<label for="private_key">
													Private Key
												</label>
											</h3>

											<p>The private key of the node.</p>
										</div>

										<input
											type="text"
											bind:value={node.private_key}
											{...$constraints.nodes?.private_key ?? {}}
											class="code"
										/>
									</section>

									<section class="row wrap">
										<div class="column inline">
											<h3 class="row inline">
												<label for="private_key">
													Forward Stats?
												</label>
											</h3>

											<p>If checked, register this node to be shown publicly on the Infernet explorer.</p>
										</div>

										<Switch
											bind:checked={node.forward_stats}
											labelText="Forward Stats?"
										/>
									</section>
								</fieldset>
							</Collapsible>

							<section class="column">
								<div class="row">
									<div class="column inline">
										<h3>
											Containers
										</h3>

										<p>Assign new or existing container configurations to this node.</p>
									</div>

									<a
										href="/clusters/create/container"
										on:click={async (e) => {
											e.preventDefault()

											const { href } = e.currentTarget

											const result = await preloadData(href)

											if (result.type === 'loaded' && result.status === 200) {
												pushState(href, {
													showContainerForm: 'create',
													containerFormData: result.data,
												})
											} else {
												console.error(`Failed to preload shallow route: ${href}`)
												goto(href)
											}
										}}
									>
										<button
											type="button"
											class="primary"
										>Add Container</button>
									</a>
								</div>

								<NodeContainersTable
									containers={node.containers}
									onEdit={async container => {
										const href = `/clusters/create/container`

										const result = {
											type: 'loaded',
											status: 200,
											data: {
												formData: {
													container,
												},
											},
										}

										if (result.type === 'loaded' && result.status === 200) {
											pushState(href, {
												showContainerForm: 'edit',
												containerId: container.container_id,
												containerFormData: result.data,
											})
										} else {
											console.error(`Failed to preload shallow route: ${href}`)
											goto(href)
										}
									}}
								/>

								<Dialog
									title={`Customize container`}
									open={Boolean($page.state.showContainerForm)}
									onClose={() => {
										history.back()
									}}
								>
									<ContainerForm
										data={$page.state.containerFormData}
										mode={$page.state.showContainerForm}
										{...(
											$page.state.showContainerForm === 'create' ?
												{
													submitLabel: 'Add Container',

													onSubmit: ({ container }) => {
														node.containers.push(container)
														node.containers = node.containers

														history.back()
													},
												}
											: $page.state.showContainerForm === 'edit' ?
												{
													submitLabel: 'Save Changes',

													onSubmit: ({ container }) => {
														node.containers[
															node.containers.findIndex(container => container.container_id === $page.state.containerId)
														] = container

														node.containers = node.containers
														history.back()
													},
												}
											:
												{}
										)}
										onCancel={() => {
											history.back()
										}}
										placement={'in-modal'}
									/>
								</Dialog>
							</section>
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
								on:click={() => $form.nodes = [...$form.nodes, Node.parse({})]}
							>
								Add Node
							</button>

							<button
								type="submit"
								class="primary"
								disabled={$submitting}
							>
								Submit
							</button>
						</div>
					</footer>
				{/if}
			</fieldset>
		</svelte:fragment>
	</Tabs>
</form>
