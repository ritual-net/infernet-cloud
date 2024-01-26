<script lang="ts">
	// Types
	import type { PageData } from './$types'

	enum Fieldset {
		CreateCluster,
		AddNodes,
	}


	// Data
	import { Node } from './schema'


	// Internal state
	import { page } from '$app/stores'
	import { superForm } from 'sveltekit-superforms/client'

	const { form, enhance, errors, constraints } = superForm(($page.data as PageData).form, {
		dataType: 'json',
	})

	let currentFieldset = Fieldset.CreateCluster


	// Components
	import Switch from '$components/Switch.svelte'
	import Select from '$components/Select.svelte'
	import Tabs from '$components/Tabs.svelte'


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
								items={[
									{
										value: crypto.randomUUID(),
										label: 'Service Account 1',
										icon: '',
									},
								]}
							/>
						</section>

						<!-- <section class="row wrap">
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
								bind:value={$form.cluster.region}
								items={[
									{
										value: 'US-north-1',
										label: 'US-north-1',
									},
								]}
							/>
						</section> -->
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

							<section class="row">
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

							<fieldset disabled={!node.chain_enabled} class="card column">
								<section class="row">
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

								<section class="row">
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

								<section class="row">
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

								<section class="row">
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

								<section class="row">
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
									/>
								</section>

								<section class="row">
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
