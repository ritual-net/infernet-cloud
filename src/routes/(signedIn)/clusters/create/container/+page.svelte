<script lang="ts">
	// Schema
	import type { Container, ContainerTemplate } from '$schema/interfaces'


	// Context
	import type { PageData } from './$types'

	export let data: PageData
	const {
		formData,
		containerTemplatesPromise,
		imagesPromise,
		nodeConfiguration,
		dockerUserImages,
	} = data


	// Inputs
	// (View options)
	export let placement: 'standalone' | 'in-modal' = 'standalone'
	export let mode: 'create' | 'edit' = 'create'
	export let submitLabel = 'Add container'


	// Schema
	import { FormData } from './schema'


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
	} = superForm(formData, {
		dataType: 'json',
		customValidity: true,
		validators: yupClient(FormData),
		SPA: true,

		onUpdate: ({ form, result, cancel }) => {
			if(mode === 'create')
				$form.container.id ||= crypto.randomUUID()

			if(result.type === 'success'){
				onSubmit?.($form)
			}
		},
	})

	export const snapshot = { capture, restore }


	// (Templates)
	let containerTemplates: ContainerTemplate[] | undefined
	$: if(containerTemplatesPromise) (async () => { containerTemplates = await containerTemplatesPromise })()

	let containerTemplateId: string | undefined

	$: if(containerTemplates && containerTemplateId){
		const containerTemplate = containerTemplates.find(containerTemplate => containerTemplate.id === containerTemplateId)

		if(containerTemplate && globalThis?.confirm(`Start from template "${containerTemplate.name}"?`)){
			const {
				id,
				name,
				chain_enabled,
				chain_id,
				docker_account,
				...newContainer
			} = globalThis.structuredClone(containerTemplate)

			$form.container = newContainer as Omit<Container, 'id'>
		}else{
			containerTemplateId = undefined
		}
	}


	// (Images)
	let images: string[] | undefined
	$: (async () => { images = await imagesPromise })()


	// Events
	import { goto } from '$app/navigation'

	export let onSubmit: (_: typeof $form) => void = () => {
		goto('/clusters/create/#/nodes')
	}

	export let onCancel: () => void = () => {
		goto('/clusters/create/#/nodes')
	}


	// Components
	import FormSubmitButton from '$/components/FormSubmitButton.svelte'
	import Select from '$/components/Select.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import ContainerFormFields from './ContainerFormFields.svelte'
</script>


<svelte:head>
	<title>Create Cluster | Infernet Cloud</title>
</svelte:head>


<form
	class="column"
	method="POST"
	use:enhance
>
	{#if placement === 'standalone'}
		<header>
			<h2>Customize container</h2>
		</header>
	{/if}

	{#if mode === 'create'}
		<fieldset class="card column">
			<header>
				Start from template
			</header>

			<section class="row wrap">
				<div class="column inline">
					<h3>
						<label for="containerTemplateId">
							Container template
						</label>

						<span class="annotation">Optional</span>
					</h3>

					<p>Choose a <a href="/templates">container template</a> to pre-fill variables from.</p>
				</div>

				<Select
					id="containerTemplateId"
					name="containerTemplateId"
					labelText="Container template"
					placeholder={containerTemplates?.length ? `Select template...` : `No templates found.`}
					bind:value={containerTemplateId}
					items={
						containerTemplates
							? Array.from(
								Map.groupBy(containerTemplates, containerTemplate => containerTemplate.container_id)
									.entries(),
								([containerId, containerTemplates]) => ({
									value: containerId,
									label: containerId,
									items: containerTemplates.map(containerTemplate => ({
										value: containerTemplate.id,
										label: containerTemplate.name,
										disabled: containerTemplate.docker_account && nodeConfiguration.dockerAccountUsername && containerTemplate.docker_account.username !== nodeConfiguration.dockerAccountUsername,
									})),
								}),
							)
							: []
					}
				/>
			</section>
		</fieldset>
	{/if}

	<ContainerFormFields
		bind:container={$form.container}
		constraints={$constraints.container}
		{images}
		{nodeConfiguration}
		{dockerUserImages}
	/>

	<footer class="row">
		<div class="row">
			<button
				type="button"
				on:click={onCancel}
			>
				Cancel
			</button>
		</div>

		<div class="row">
			<FormSubmitButton
				submitting={$submitting}
				allErrors={$allErrors}
				{submitLabel}
			/>
		</div>
	</footer>
</form>
