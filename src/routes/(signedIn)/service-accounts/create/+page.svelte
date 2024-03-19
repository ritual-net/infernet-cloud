<script lang="ts">
	// Constants
	import { ProviderTypeEnum, providers } from '$/types/provider'

	enum Fieldset {
		ChooseCloudProvider,
		CloudProviderConfig,
	}


	// Data
	import { FormData, AwsCredentials, GcpCredentials } from './schema'


	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	const {
		formData,
	} = $page.data as PageData


	// Actions
	import { addToast } from '$/components/Toaster.svelte'


	// Internal state
	import { superForm } from 'sveltekit-superforms/client'
	import { yupClient } from 'sveltekit-superforms/adapters'

	const {
		form,
		enhance,
		errors,	
		allErrors,
		constraints,
		submitting,
	} = superForm(formData, {
		dataType: 'json',
		customValidity: true,
		validators: yupClient(FormData),

		onResult: ({ result }) => {
			if(result.type === 'failure')
				addToast({
					data: {
						type: 'error',
						title: `Couldn't connect service account.`,
						description: result.data && (result.data.result?.message ?? JSON.stringify(result.data.result)),
					},
				})
		},
	})

	let currentFieldset = Fieldset.ChooseCloudProvider


	// Components
	import Select from '$/components/Select.svelte'
	import Tabs from '$/components/Tabs.svelte'


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
								id="provider"
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
								id="name"
								name="name"
								placeholder="My First Infernet Cluster"
								bind:value={$form.name}
								{...$constraints.name}
							/>
						</section>
					</div>

					<footer class="row">
						<a
							class="button"
							href="."
						>
							Cancel
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
						<section class="column">
							<h3>
								Instructions
							</h3>

							{#if $form.provider === 'AWS'}
								<ol class="column">
									<li>
										<p class="row wrap">
											<span>
												Install the <a href="https://aws.amazon.com/cli" target="_blank"><code>aws</code> CLI</a>.
											</span>

											<a
												class="button small"
												href="https://aws.amazon.com/cli"
												target="_blank"
											>
												Install CLI
											</a>
										</p>
									</li>

									<li>
										<p class="row wrap">
											<span>
												Download and run the following script in a terminal to create an IAM user:
											</span>

											<a
												class="button small"
												href="https://raw.githubusercontent.com/ritual-net/infernet-deploy/main/procure/aws/create_service_account.sh"
												target="_blank"
												download
											>
												Download Script
											</a>
										</p>
									</li>

									<li>
										<p>Paste the JSON output below (everything after "Service account details:").</p>
									</li>
								</ol>

							{:else if $form.provider === 'GCP'}
								<ol class="column">
									<li>
										<p class="row wrap">
											<span>
												Sign into <a href="https://console.cloud.google.com" target="_blank">Google Cloud Console</a> and <a href="https://support.google.com/googleapi/answer/6251787?ref_topic=7014522&sjid=9306585338551455963-NC#zippy=%2Ccreate-a-project" target="_blank">create a new Project</a>.
											</span>

											<a
												class="button small"
												href="https://console.cloud.google.com"
												target="_blank"
											>
												Go to Google Cloud Console
											</a>
										</p>
									</li>

									<li>
										<p class="row wrap">
											<span>
												Enable the <a href="https://console.cloud.google.com/apis/library/compute.googleapis.com" target="_blank">Compute Engine API</a> for your Project.
											</span>

											<a
												class="button small"
												href="https://console.cloud.google.com/apis/library/compute.googleapis.com"
												target="_blank"
											>
												Enable Compute Engine API
											</a>
										</p>
									</li>

									<li>
										<p class="row wrap">
											<span>
												Install the <a href="https://cloud.google.com/sdk/docs/install" target="_blank"><code>gcloud</code> CLI</a> on your local machine.
											</span>

											<a
												class="button small"
												href="https://cloud.google.com/sdk/docs/install"
												target="_blank"
											>
												Install CLI
											</a>
										</p>
									</li>

									<li>
										<p class="row wrap">
											<span>
												Locate your Project's <a href="https://support.google.com/googleapi/answer/7014113" target="_blank">Project ID</a> for the next step.
											</span>

											<a
												class="button small"
												href="https://support.google.com/googleapi/answer/7014113"
												target="_blank"
												download
											>
												Locate Project ID
											</a>
										</p>
									</li>

									<li>
										<p class="row wrap">
											<span>
												Download and run the following script in a terminal to create a Service Account User:
											</span>

											<a
												class="button small"
												href="https://raw.githubusercontent.com/ritual-net/infernet-deploy/main/procure/gcp/create_service_account.sh"
												target="_blank"
												download
											>
												Download Script
											</a>
										</p>
									</li>

									<li>
										<p>A key file will be generated for the Service Account User. Paste its contents below (JSON object under "Service account details")</p>
									</li>
								</ol>
							{/if}
						</section>

						<section class="column wrap">
							<div class="column inline">
								<h3>
									<label for="credentials">
										{#if $form.provider === 'GCP'}
											Key File
										{:else if $form.provider === 'AWS'}
											Credentials
										{/if}
									</label>
								</h3>

								<p></p>
							</div>

							<!-- <Tabs
								value={1}
								items={[
									// {
									// 	id: 0,
									// 	label: 'Enter Manually',
									// },
									{
										id: 1,
										label: 'Use JSON',
									},
								]}
							>
								<svelte:fragment slot="content"
									let:item
								>
									{#if item.id === 0} -->
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

									<!-- {:else} -->
										<div class="stack">
											<textarea
												name="credentials"
												rows="13"
												placeholder={
													JSON.stringify(
														{
															['GCP']: GcpCredentials.getDefault(),
															['AWS']: AwsCredentials.getDefault(),
														}[$form.provider],
														null,
														'\t'
													)
												}
												value={$form.credentials && Object.entries($form.credentials).length ? JSON.stringify($form.credentials) : ''}
												on:input={(e) => {
													try {
														$form.credentials = JSON.parse(e.target.value)
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

										{#each Object.values($errors.credentials ?? []).filter(Boolean) as error}
											<p>{error}</p>
										{/each}
									<!-- {/if}
								</svelte:fragment>
							</Tabs> -->
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
								disabled={$submitting || $allErrors.length > 0}
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
