<script lang="ts">
	// Types
	import type { PageData } from './$types'

	enum Fieldset {
		CreateCluster,
		AddNodes,
	}


	// Data
	import { createNode } from './schema'


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
									<label for="region">
										Service Account
									</label>
								</h3>

								<p></p>
							</div>

							<Select
								required
								name="serviceAccount"
								labelText="Service Account"
								bind:value={$form.serviceAccount}
								items={[
									{
										value: 'service-account-1',
										label: 'Service Account 1',
										icon: '',
									},
								]}
							/>
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
								bind:value={$form.region}
								items={[
									{
										value: 'US-north-1',
										label: 'US-north-1',
									},
								]}
							/>
						</section>

						<section class="row wrap">
							<div class="column inline">
								<h3 class="row inline wrap">
									<label for="credentials">
										Docker Credentials
									</label>

									<span class="annotation">Optional</span>
								</h3>

								<p>Upload your config.json for Docker, or sign in with oAuth.</p>
							</div>

							<button type="button">
								Sign in with Docker
							</button>
						</section>
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
										<label for="region">
											Onchain?
										</label>
									</h3>

									<p>Determines if the node is listening to Ritual chain for events, or whether it is latent.</p>
								</div>

								<Switch
									bind:checked={node.isOnchain}
									labelText="Onchain"
								/>
							</section>

							<section class="row">
								<div class="column inline">
									<h3 class="row inline">
										<label for="credentials">
											Docker Credentials
										</label>

										<span class="annotation">Optional</span>
									</h3>

									<p>Upload your config.json for Docker, or sign in with oAuth..</p>
								</div>

								<button type="button">
									Sign in with Docker
								</button>
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
								on:click={() => $form.nodes = [...$form.nodes, createNode()]}
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
