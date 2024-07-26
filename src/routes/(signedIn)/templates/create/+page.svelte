<script lang="ts">
	// Context
	import type { PageData } from './$types'

	export let data: PageData
	const {
		dockerAccounts,
		imagesPromise,
		formData,
	} = data


	// Schema
	import { FormData } from './schema'


	// Functions
	import { resolveRoute } from '$app/paths'
	import { createQuery } from '@tanstack/svelte-query'


	// Actions
	import { type Toast, addToast, removeToast } from '$/components/Toaster.svelte'


	// Internal state
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
				title: `Adding container template...`,
			},
		})
	}else{
		if(delayedToast)
			removeToast(delayedToast.id)
	}


	// (Docker images)
	let images: string[] | undefined

	$: imagesPromise.then(_ => images = _)

	let dockerUserImages: string[] | undefined

	$: dockerUserImagesQuery = $form.dockerAccountUsername
		? createQuery({
			queryKey: ['dockerUserImages', {
				dockerAccountUsername: $form.dockerAccountUsername,
			}] as const,
			queryFn: async ({
				queryKey: [_, {
					dockerAccountUsername,
				}],
			}) => (
				fetch(resolveRoute('/api/docker_images/[dockerAccountUsername]', { dockerAccountUsername }))
					.then(response => response.json())
			),
		})
		: undefined

	$: dockerUserImages = dockerUserImagesQuery && (
		$dockerUserImagesQuery!.data
			?.map(slug => ({
				value: slug,
				label: slug,
			}))
	)


	// Components
	import ChainCombobox from '$/views/ChainCombobox.svelte'
	import Collapsible from '$/components/Collapsible.svelte'
	import FormSubmitButton from '$/components/FormSubmitButton.svelte'
	import Select from '$/components/Select.svelte'
	import Switch from '$/components/Switch.svelte'
	import ContainerFormFields from '$/routes/(signedIn)/clusters/create/container/ContainerFormFields.svelte'
</script>


<div class="container column">
	<header>
		<h2>New container template</h2>
	</header>

	<form
		class="column"
		method="POST"
		use:enhance
	>
		<div class="card column">
			<header>
				Container template
			</header>

			<section class="row wrap">
				<div class="column inline">
					<h3>
						<label for="name">
							Name
						</label>
					</h3>
			
					<p>A unique name for the container template.</p>
				</div>
			
				<input
					id="containerTemplate.name"
					name="containerTemplate.name"
					type="text"
					placeholder="My Container Template"
					bind:value={$form.containerTemplate.name}
					{...$constraints?.containerTemplate?.name}
				/>
			</section>
		</div>

		<div class="card column">
			<header>
				Node configuration
			</header>

			<section class="row wrap">
				<div class="column inline">
					<h3>
						<label for="containerTemplate.chain_enabled">
							Onchain?
						</label>
					</h3>
			
					<p>
						Whether the node running this container will listen and respond to
						<br>
						onchain events, and optionally accept payments from subscriptions.
					</p>
				</div>
			
				<Switch
					id="containerTemplate.chain_enabled"
					name="containerTemplate.chain_enabled"
					bind:checked={$form.containerTemplate.chain_enabled}
					labelText="Onchain?"
				/>
			</section>

			<Collapsible open={$form.containerTemplate.chain_enabled}>
				<fieldset disabled={!$form.containerTemplate.chain_enabled}>
					<section class="row wrap">
						<div class="column inline">
							<h3>
								<label for="containerTemplate.chain_id">
									Chain ID
								</label>
							</h3>

							<p>The chain ID of the EVM-based network the node is connected to.</p>
						</div>

						<ChainCombobox
							id="containerTemplate.chain_id"
							name="containerTemplate.chain_id"
							bind:chainId={$form.containerTemplate.chain_id}
						/>
					</section>
				</fieldset>
			</Collapsible>

			<section class="row wrap">
				<div class="column inline">
					<h3 class="row inline">
						<label for="dockerAccountUsername">
							Docker Hub Account
						</label>
			
						<span class="annotation">Optional</span>
					</h3>
			
					<p><a href="/cloud-accounts/docker/connect">Connect your Docker Hub account</a> to allow the node to access private Docker images.</p>
				</div>
			
				<Select
					id="dockerAccountUsername"
					name="dockerAccountUsername"
					labelText="Docker Hub Username"
					bind:value={$form.dockerAccountUsername}
					{...!dockerAccounts
						? {
							placeholder: 'Loading...',
							items: [
								{
									value: '',
									label: 'None'
								},
								$form.dockerAccountUsername && {
									value: $form.dockerAccountUsername,
									label: $form.dockerAccountUsername,
								}
							].filter(Boolean),
							visuallyDisabled: true,
						}
						: {
							placeholder: 'Choose Docker Hub user...',
							items: [
								{
									value: '',
									label: 'None'
								},
								...dockerAccounts.map(dockerAccount => ({
									value: dockerAccount.username,
									label: dockerAccount.username,
								}))
							],
						}
					}
					{...$constraints?.dockerAccountUsername}
				/>
			</section>
		</div>

		<ContainerFormFields
			bind:container={$form.containerTemplate}
			constraints={$constraints.containerTemplate}
			{images}
			{dockerUserImages}
			nodeConfiguration={{
				hasGpu: true,
				isOnchain: $form.containerTemplate.chain_enabled,
				chainId: $form.containerTemplate.chain_id,
				isPaymentsEnabled: true,
				dockerAccountUsername: $form.dockerAccountUsername,
			}}
		>
			<svelte:fragment slot="title">
				Container configuration
			</svelte:fragment>
		</ContainerFormFields>

		<footer class="row">
			<div class="row">
				<a
					class="button"
					href="."
				>
					Cancel
				</a>
			</div>

			<div class="row">
				<FormSubmitButton
					submitting={$submitting}
					allErrors={$allErrors}
					submitLabel="Add Container Template"
				/>
			</div>
		</footer>
	</form>
</div>
