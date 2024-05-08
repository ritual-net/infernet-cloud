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


	// API
	import { resolveRoute } from '$app/paths'
	import type { DockerHubClient } from '$/lib/docker/docker'


	// Functions
	import { serializeEnvObject, parseEnvString } from '$/lib/utils/env'
	import { parseCommaSeparated, serializeCommaSeparated } from '$/lib/utils/commaSeparated'


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


	// (Firewall)
	let hasFirewall = (
		Boolean($form.container.allowed_ips.length)
		|| (isOnchain && Boolean($form.container.allowed_addresses.length || $form.container.allowed_delegate_addresses.length))
	)

	let allowed_ips = $form.container.allowed_ips ?? []
	let allowed_addresses = $form.container.allowed_addresses ?? []
	let allowed_delegate_addresses = $form.container.allowed_delegate_addresses ?? []

	$: $form.container.allowed_ips = hasFirewall ? allowed_ips : []
	$: $form.container.allowed_addresses = hasFirewall ? allowed_addresses : []
	$: $form.container.allowed_delegate_addresses = hasFirewall ? allowed_delegate_addresses : []


	// (Images)
	let images: string[] | undefined
	$: (async () => { images = await imagesPromise })()

	import { createQuery } from '@tanstack/svelte-query'

	let dockerImagesQueryValue: string = $form.container.image

	$: dockerImagesQuery = dockerImagesQueryValue
		? createQuery({
			queryKey: ['dockerImages', {
				query: dockerImagesQueryValue,
			}] as const,

			queryFn: async ({
				queryKey: [_, {
					query,
				}],
			}) => (
				await fetch(`/api/images/search?${new URLSearchParams({ query })}`)
					.then(response => response.json()) as Awaited<ReturnType<DockerHubClient['searchImages']>>
			),

			select: result => (
				result.results.map(item => ({
					value: item.slug,
					label: item.slug,
				}))
			),
		})
		: undefined

	$: dockerImages = dockerImagesQuery && $dockerImagesQuery!.data


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
	import Textarea from '$/components/Textarea.svelte'
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
				bind:inputValue={dockerImagesQueryValue}
				items={(
					[
						dockerUserImages && {
							value: 'docker',
							label: `Docker Hub › ${dockerAccountUsername}`,
							items: dockerUserImages,
						},

						images && {
							value: 'ritualnetwork',
							label: 'Ritual',
							items: images.map(image => ({
								value: image,
								label: image,
							})),
						},

						dockerImages && {
							value: 'docker',
							label: 'Docker Hub › Community',
							items: dockerImages,
						},

						(
							dockerImagesQueryValue?.trim()
							&& !images?.some(value => value === dockerImagesQueryValue.trim())
							&& !dockerImages?.some(image => image.value === dockerImagesQueryValue.trim())
						) && {
							value: 'custom',
							label: 'Custom',
							items: [
								{
									value: dockerImagesQueryValue.trim(),
									label: dockerImagesQueryValue.trim(),
								}
							].filter(Boolean),
						},
					].filter(Boolean)
				)}
				placeholder={`Choose or search for an image...`}
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

		<section class="column wrap">
			<div class="row wrap">
				<div class="column inline">
					<h3 class="row inline">
						<label for="hasFirewall">
							Firewall
						</label>
					</h3>

					<p>Specify which IP addresses{isOnchain ? ' and onchain addresses' : ''} can request execution of this container.</p>
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
							label: isOnchain ? 'All IPs and addresses' : 'All IPs',
						},
						{
							value: true,
							label: isOnchain ? 'Only allowed IPs and addresses' : 'Only allowed IPs',
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
							label: 'IPs',
						},
						{
							id: 1,
							label: 'Addresses',
						},
						{
							id: 2,
							label: 'Delegate Addresses',
						},
					]}
				>
					<svelte:fragment slot="content"
						let:item
					>
						{#if item.id === 0}
							<Textarea
								id="container.allowed_ips"
								name="container.allowed_ips"
								rows="2"
								placeholder={`Enter a comma-separated list of IP addresses...\n0.0.0.1, 0.0.0.2`}
								value={serializeCommaSeparated(allowed_ips)}
								onblur={e => { allowed_ips = parseCommaSeparated(e.currentTarget.value) }}
								{...$constraints.container?.allowed_ips}
								disabled={!hasFirewall}
							/>

						{:else if item.id === 1}
							<Textarea
								id="container.allowed_addresses"
								name="container.allowed_addresses"
								rows="2"
								placeholder={`Enter a comma-separated list of EVM addresses...\n0xabcd...6789, 0x1234...cdef`}
								value={serializeCommaSeparated(allowed_addresses)}
								onblur={e => { allowed_addresses = parseCommaSeparated(e.currentTarget.value) }}
								{...$constraints.container?.allowed_addresses}
								disabled={!(hasFirewall && isOnchain)}
							/>

						{:else if item.id === 2}
							<Textarea
								id="container.allowed_delegate_addresses"
								name="container.allowed_delegate_addresses"
								rows="2"
								placeholder={`Enter a comma-separated list of EVM addresses...\n0xabcd...6789, 0x1234...cdef`}
								value={serializeCommaSeparated(allowed_delegate_addresses)}
								onblur={e => { allowed_delegate_addresses = parseCommaSeparated(e.currentTarget.value) }}
								{...$constraints.container?.allowed_delegate_addresses}
								disabled={!(hasFirewall && isOnchain)}
							/>
						{/if}
					</svelte:fragment>
				</Tabs>
			{/if}
		</section>

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

			<Textarea
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

			<Textarea
				id="container.env"
				name="container.env"
				rows="2"
				placeholder={`EXAMPLE_VARIABLE_1=hello\nEXAMPLE_VARIABLE_2=world`}
				value={serializeEnvObject($form.container.env)}
				onblur={e => { $form.container.env = parseEnvString(e.currentTarget.value) }}
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
