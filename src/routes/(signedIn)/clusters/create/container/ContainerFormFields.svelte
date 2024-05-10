<script lang="ts">
	// Types/constants
	import type { InputConstraints } from 'sveltekit-superforms'
	import * as z from 'yup'


	// Schema
	import { Container } from './schema'


	// Inputs
	export let container: z.InferType<typeof Container>
	export let constraints: InputConstraints<typeof container> | undefined
	export let images: string[] | undefined
	export let isOnchain: boolean
	export let dockerAccountUsername: string | undefined
	export let dockerUserImages: string[] | undefined


	// API
	import type { DockerHubClient } from '$/lib/docker/docker'


	// Functions
	import { serializeEnvObject, parseEnvString } from '$/lib/utils/env'
	import { parseCommaSeparated, serializeCommaSeparated } from '$/lib/utils/commaSeparated'


	// Internal state

	// (Firewall)
	let hasFirewall = (
		Boolean(container.allowed_ips.length)
		|| (isOnchain && Boolean(container.allowed_addresses.length || container.allowed_delegate_addresses.length))
	)

	let allowed_ips = container.allowed_ips ?? []
	let allowed_addresses = container.allowed_addresses ?? []
	let allowed_delegate_addresses = container.allowed_delegate_addresses ?? []

	$: container.allowed_ips = hasFirewall ? allowed_ips : []
	$: container.allowed_addresses = hasFirewall ? allowed_addresses : []
	$: container.allowed_delegate_addresses = hasFirewall ? allowed_delegate_addresses : []


	// (Images)
	import { createQuery } from '@tanstack/svelte-query'

	let dockerImagesQueryValue: string = container.image

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


	// Components
	import Combobox from '$/components/Combobox.svelte'
	import Switch from '$/components/Switch.svelte'
	import Select from '$/components/Select.svelte'
	import Tabs from '$/components/Tabs.svelte'
	import Textarea from '$/components/Textarea.svelte'
</script>


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
			bind:value={container.image}
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
			{...constraints?.image}
		/>
	</section>

	<section class="row wrap">
		<div class="column inline">
			<h3 class="row inline">
				<label for="container.container_id">
					Service ID
				</label>
			</h3>

			<p>Set an ID to represent this container's intended workflow. <br>May be shared across similarly configured containers.</p>
		</div>

		<input
			type="text"
			id="container.container_id"
			name="container.container_id"
			bind:value={container.container_id}
			placeholder={`organization-toolkit-model-version`}
			{...constraints?.container_id ?? {}}
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
			bind:value={container.description}
			placeholder={`Enter a description here...`}
			{...constraints?.description ?? {}}
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
			bind:value={container.external}
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
			bind:checked={container.gpu}
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
							{...constraints?.allowed_ips}
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
							{...constraints?.allowed_addresses}
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
							{...constraints?.allowed_delegate_addresses}
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
			bind:value={container.command}
			rows="1"
			placeholder={`--flag-1=hello --flag-2=world`}
			{...constraints?.command}
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
			value={serializeEnvObject(container.env)}
			onblur={e => { container.env = parseEnvString(e.currentTarget.value) }}
			{...constraints?.env}
			class="code"
		/>
	</section>
</fieldset>
