<script lang="ts">
	// Context
	import type { PageData } from './$types'

	export let data: PageData
	const {
		formData,
		imagesPromise, // Promise<string[]> | string[]
	} = data

	let configurations = []


	// Inputs
	// (View options)
	export let placement: 'standalone' | 'in-modal' = 'standalone'
	export let mode: 'create' | 'edit' = 'create'
	export let submitLabel = 'Add Container'


	// Internal state
	let images: string[] | undefined
	$: (async () => { images = await imagesPromise })()


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

		onSubmit: ({ cancel }) => {
			if(mode === 'create')
				$form.container.container_id = crypto.randomUUID()

			onSubmit?.($form)

			cancel()
		},
	})

	export const snapshot = { capture, restore }

	let allowIps: 'all' | 'restricted' = 'all'

	let startingConfig: typeof form


	// Events
	import { goto } from '$app/navigation'

	export let onSubmit: (_: typeof $form) => void = () => {
		goto('/clusters/create/#/nodes')
	}

	export let onCancel: () => void = () => {
		goto('/clusters/create/#/nodes')
	}


	// Components
	import Combobox from '$/components/Combobox.svelte'
	import Switch from '$/components/Switch.svelte'
	import Select from '$/components/Select.svelte'
	import Tabs from '$/components/Tabs.svelte'
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

	<fieldset class="card column">
		<header>
			Customize container
		</header>

		<section class="row wrap">
			<div class="column inline">
				<h3>
					<label for="container.image">
						Image
					</label>
				</h3>

				<p>Choose the image this container is deployed with.</p>
			</div>

			<Combobox
				id="container.image"
				name="container.image"
				labelText="Image"
				bind:value={$form.container.image}
				{...!images
					? {
						items: [],
						placeholder: `Loading images...`,
						disabled: true,
					}
					: {
						items: images
							.map(image => ({
								value: image,
								label: image,
							})),
						placeholder: `Choose an image...`,
					}
				}
				{...$constraints.container?.image}
			/>
		</section>

		<section class="row wrap">
			<div class="column inline">
				<h3 class="row inline">
					<label for="container.description">
						Description
					</label>

					<span class="annotation">Optional</span>
				</h3>

				<p>Add a description for this container.</p>
			</div>

			<input
				type="text"
				id="container.description"
				name="container.description"
				bind:value={$form.container.description}
				placeholder={`Enter a description here...`}
				{...$constraints.container?.description ?? {}}
			/>
		</section>

		<section class="row wrap">
			<div class="column inline">
				<h3>
					<label for="container.external">
						Visibility
					</label>
				</h3>

				<p>Determine if container is publicly accessible.</p>
			</div>

			<Select
				required
				id="container.external"
				name="container.external"
				labelText="Visibility"
				bind:value={$form.container.external}
				items={[
					{
						value: true,
						label: 'External',
					},
					{
						value: false,
						label: 'Internal',
					},
				]}
			/>
		</section>

		<section class="row wrap">
			<div class="column inline">
				<h3>
					<label for="container.gpu">
						Has GPU?
					</label>
				</h3>

				<p>Determine if GPU-enabled.</p>
			</div>

			<Switch
				id="container.gpu"
				name="container.gpu"
				bind:checked={$form.container.gpu}
				labelText="Has GPU?"
			/>
		</section>

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
							id="container.allowed_addresses"
							name="container.allowed_addresses"
							rows="2"
							placeholder={`Enter a comma-separated list of Ethereum addresses...\n0xabcd...6789`}
							bind:value={$form.container.allowed_addresses}
							{...$constraints.container?.allowed_addresses}
							disabled={allowIps === 'all'}
						/>

					{:else if item.id === 1}
						<textarea
							id="container.allowed_delegate_addresses"
							name="container.allowed_delegate_addresses"
							rows="2"
							placeholder={`Enter a comma-separated list of Ethereum addresses...\n0xabcd...6789`}
							bind:value={$form.container.allowed_delegate_addresses}
							{...$constraints.container?.allowed_delegate_addresses}
							disabled={allowIps === 'all'}
						/>

					{:else if item.id === 2}
						<textarea
							id="container.allowed_ips"
							name="container.allowed_ips"
							rows="2"
							placeholder={`Enter a comma-separated list of IP addresses...\n0.0.0.0/1, 0.0.0.0/2`}
							bind:value={$form.container.allowed_ips}
							{...$constraints.container?.allowed_ips}
							disabled={allowIps === 'all'}
						/>
					{/if}
				</svelte:fragment>
			</Tabs>
		{/if}

		<section class="row wrap">
			<div class="column inline">
				<h3 class="row inline">
					<label for="container.command">
						Start Command
					</label>

					<span class="annotation">Optional</span>
				</h3>

				<p>Enter the start command for this container below.</p>
			</div>

			<textarea
				id="container.command"
				name="container.command"
				bind:value={$form.container.command}
				rows="1"
				placeholder={`--flag-1=hello --flag-2=world`}
				{...$constraints.container?.command}
				class="code"
			/>
		</section>

		<section class="row wrap">
			<div class="column inline">
				<h3 class="row inline">
					<label for="container.env">
						Environment Variables
					</label>

					<span class="annotation">Optional</span>
				</h3>

				<p>Please enter the contents of the .env file for this container.</p>
			</div>

			<textarea
				id="container.env"
				name="container.env"
				rows="2"
				placeholder={`EXAMPLE_VARIABLE_1=hello\nEXAMPLE_VARIABLE_2=world`}
				bind:value={$form.container.env}
				{...$constraints.container?.env}
				class="code"
			/>
		</section>
	</fieldset>

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
