<script lang="ts">
	// Constants
	import { ProviderTypeEnum, providers } from '$types/provider'

	enum Fieldset {
		ChooseCloudProvider,
		CloudProviderConfig,
	}


	// Data
	import { AwsCredentials, GcpCredentials } from './schema'


	// Context
	import type { PageData } from './$types'

	const {
		form: formData,
	} = $page.data as PageData


	// Internal state
	import { page } from '$app/stores'
	import { superForm } from 'sveltekit-superforms/client'

	const { form, enhance, errors, constraints } = superForm(formData, {
		dataType: 'json',
	})

	let currentFieldset = Fieldset.ChooseCloudProvider


	// Components
	import Select from '$components/Select.svelte'
	import Tabs from '$components/Tabs.svelte'


	// Transitions/animations
	import { fly } from 'svelte/transition'
</script>


<form
	method="POST"
	use:enhance
	class="column"
>
	<Tabs
		bind:value={currentFieldset}
		items={[
			{
				id: Fieldset.ChooseCloudProvider,
				label: 'Choose cloud provider',
			},
			{
				id: Fieldset.CloudProviderConfig,
				label: `Set up ${providers[$form.provider].name}`,
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

				{#if item.id === Fieldset.ChooseCloudProvider}
					<div class="card column">
						<section class="row wrap">
							<div class="column inline">
								<h3>
									<label for="provider">
										Provider
									</label>
								</h3>

								<p></p>
							</div>

							<Select
								required
								name="provider"
								bind:value={$form.provider}
								placeholder="Select provider..."
								items={Object.values(ProviderTypeEnum).map(provider => ({
									icon: providers[provider].icon,
									value: provider,
									label: providers[provider].name,
								}))}
							/>
						</section>

						<section class="row wrap">
							<div class="column inline">
								<h3>
									<label for="name">
										Name
									</label>
								</h3>

								<p></p>
							</div>

							<input
								type="text"
								name="name"
								placeholder="My First Infernet Cluster"
								bind:value={$form.name}
								{...$constraints.name}
							/>
						</section>
					</div>

					<footer class="row">
						<a href=".">
							<button type="button">
								Cancel
							</button>
						</a>
				
						<div class="row">
							<button
								type="button"
								class="primary"
								on:click={() => currentFieldset++}
							>
								Continue
							</button>
						</div>
					</footer>

				{:else if item.id === Fieldset.CloudProviderConfig}
					<div class="card column">
						<section class="column wrap">
							<div class="column inline">
								<h3>
									<label for="credentials">
										Credentials
									</label>
								</h3>

								<p></p>
							</div>

							<Tabs
								value={0}
								items={[
									{
										id: 0,
										label: 'Enter Manually',
									},
									{
										id: 1,
										label: 'Use JSON',
									},
								]}
							>
								<svelte:fragment slot="content"
									let:item
								>
									{#if item.id === 0}
										<!-- {#if 'project_id' in $form.credentials}
											<fieldset>
												<section class="row wrap">
													<div class="column inline">
														<h3>
															<label for="name">
																Project ID
															</label>
														</h3>
						
														<p></p>
													</div>
						
													<input
														type="text"
														name="name"
														placeholder="Enter project ID..."
														bind:value={$form.credentials.project_id}
													/>
												</section>
											</fieldset>
										{:else}

										{/if} -->

									{:else}
										<div class="stack">
											<textarea
												name="credentials"
												rows="13"
												placeholder={
													JSON.stringify(
														{
															['GCP']: GcpCredentials,
															['AWS']: AwsCredentials,
														}[$form.provider]
														.parse({}),
														null,
														'\t'
													)
												}
												value={JSON.stringify($form.credentials)}
												on:input={() => {
													try {
														$form.credentials = JSON.parse($form.credentials)
													}catch(e){

													}
												}}
												{...$constraints.credentials}
												aria-invalid={$errors.credentials ? 'true' : undefined}
											/>

											<button
												type="button"
												class="small"
												style="
													margin: 1em;
													place-self: end end
												"
												on:click={async e => {
													// $form.credentials = JSON.parse(await navigator.clipboard.readText())

													// @ts-ignore
													e.target.previousElementSibling.value = await navigator.clipboard.readText()
												}}
											>Paste from clipboard</button>
										</div>
									{/if}
								</svelte:fragment>
							</Tabs>
						</section>
					</div>

					<footer class="row">
						<div class="row">
							<button
								type="button"
								on:click={() => currentFieldset--}
							>
								Back
							</button>
						</div>
				
						<div class="row">
							<button
								type="submit"
								class="primary"
							>
								Connect
							</button>
						</div>
					</footer>
				{/if}
			</fieldset>
		</svelte:fragment>
	</Tabs>
</form>
