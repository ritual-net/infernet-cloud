<script lang="ts">
	// Context
	import type { PageData } from './$types'

	export let data: PageData
	const {
		formData,
		imagesPromise, // Promise<string[]> | string[]
		dockerAccountUsername,
		dockerUserImages,
		isOnchain,
	} = data

	let configurations = []


	// Inputs
	// (View options)
	export let placement: 'standalone' | 'in-modal' = 'standalone'
	export let mode: 'create' | 'edit' = 'create'
	export let submitLabel = 'Add Container'


	// Schema
	import { FormData } from './schema'


	// Internal state
	import { superForm } from 'sveltekit-superforms/client'
	import { yupClient } from 'sveltekit-superforms/adapters'

	const {
		form,
		enhance,
		errors,
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
	let startingConfig: typeof form


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
	import Select from '$/components/Select.svelte'
	import ContainerFormFields from './ContainerFormFields.svelte'
</script>


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
				Start from existing
			</header>

			<section class="row wrap">
				<div class="column inline">
					<h3>
						<label for="startingConfig">
							Starting configuration
						</label>
					</h3>

					<p>Choose an existing container to pre-fill variables from.</p>
				</div>

				<Select
					id="startingConfig"
					name="startingConfig"
					labelText="Starting Configuration"
					placeholder={configurations.length ? `Select container config...` : `No existing containers found`}
					bind:value={startingConfig}
					items={configurations}
				/>
			</section>
		</fieldset>
	{/if}

	<ContainerFormFields
		bind:container={$form.container}
		constraints={$constraints.container}
		{images}
		{isOnchain}
		{dockerAccountUsername}
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
			<button
				type="submit"
				class="primary"
				disabled={$submitting}
			>
				{submitLabel}
			</button>
		</div>
	</footer>
</form>
