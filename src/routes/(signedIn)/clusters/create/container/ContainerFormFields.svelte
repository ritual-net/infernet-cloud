<script lang="ts">
	// Types/constants
	import type { InputConstraints } from 'sveltekit-superforms'
	import * as z from 'yup'
	import { tokensByChainId } from '$/lib/tokens'
	import { chainsByChainId } from '$/lib/chains'


	// Schema
	import { Container } from './schema'


	// Inputs
	export let container: z.InferType<typeof Container>
	export let constraints: InputConstraints<typeof container> | undefined
	export let images: string[] | undefined
	export let nodeConfiguration: {
		hasGpu: boolean
		isOnchain: boolean
		chainId?: number
		isPaymentsEnabled?: boolean
		dockerAccountUsername?: string
	}
	export let dockerUserImages: {
		value: string,
		label: string,
	}[] | undefined


	// API
	import type { DockerHubClient } from '$/lib/docker/docker'


	// Functions
	import { serializeEnvObject, parseEnvString } from '$/lib/utils/env'
	import { parseCommaSeparated, serializeCommaSeparated } from '$/lib/utils/commaSeparated'


	// Internal state

	// (Firewall)
	let hasFirewall = (
		Boolean(container.allowed_ips?.length)
		|| (nodeConfiguration.isOnchain && Boolean(container.allowed_addresses?.length || container.allowed_delegate_addresses?.length))
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


	// (Advanced options)
	let hasAdvancedOptions = (
		Boolean(container.generates_proofs)
	)


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import Combobox from '$/components/Combobox.svelte'
	import Switch from '$/components/Switch.svelte'
	import Select from '$/components/Select.svelte'
	import SizeTransition from '$/components/SizeTransition.svelte'
	import Tabs from '$/components/Tabs.svelte'
	import Textarea from '$/components/Textarea.svelte'
	import TokenAddressCombobox from '$/views/TokenAddressCombobox.svelte'


	// Transitions
	import { scale } from 'svelte/transition'
	import { expoOut } from 'svelte/easing'
	import RitualLogo from '$/icons/RitualLogo.svelte'
	import { DockerIcon } from '$/icons'
</script>


<fieldset class="card column">
	<header>
		Customize container
	</header>

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
				<label for="container.image">
					Image
				</label>
			</h3>

			<p>Choose the <a href="https://hub.docker.com" target="_blank">Docker Hub image</a> of the container's workflow.</p>
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
						label: `Docker Hub › ${nodeConfiguration.dockerAccountUsername}`,
						items: (
							dockerUserImages
								.map(image => ({
									value: image.value,
									label: image.label,
									icon: DockerIcon,
								}))
						),
					},

					images && {
						value: 'ritualnetwork',
						label: 'Ritual',
						items: images.map(image => ({
							value: image,
							label: image,
							icon: RitualLogo,
						})),
					},

					dockerImages && {
						value: 'docker-hub',
						label: 'Docker Hub › Community',
						items: (
							dockerImages
								.map(image => ({
									value: image.value,
									label: image.label,
									icon: DockerIcon,
								}))
						),
					},

					(
						dockerImagesQueryValue?.trim()
						&& !(
							new Set([
								...images ?? [],
								...dockerImages?.map(image => image.value) ?? []
							])
								.has(
									dockerImagesQueryValue.trim().toLowerCase()
								)
						)
					) && {
						value: 'custom',
						label: 'Custom',
						items: [
							{
								value: dockerImagesQueryValue.trim().toLowerCase(),
								label: dockerImagesQueryValue.trim().toLowerCase(),
								icon: DockerIcon,
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
			<h3>
				<label for="container.external">
					Visibility
				</label>
			</h3>

			<p>Whether this container may used as the <a href="https://docs.ritual.net/infernet/node/configuration/v1_2_0#external-boolean" target="_blank">entry point of a job request</a>.</p>
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

	<section class="column">
		<div class="row">
			<div class="column inline">
				<h3>
					<label for="container.gpu">
						Uses GPU?
					</label>
				</h3>

				<p>Specify if the container requires a GPU to run jobs.</p>
			</div>

			<Switch
				id="container.gpu"
				name="container.gpu"
				bind:checked={container.gpu}
				labelText="Has GPU?"
			/>
		</div>

		{#if !nodeConfiguration.hasGpu && container.gpu}
			<div
				class="card warning row"
				data-before="⚠️"
			>
				<p>Note: This container may not operate correctly as the node is not currently configured with a GPU. Be sure to choose a zone / machine type with GPU support.</p>
			</div>
		{/if}
	</section>

	<section class="column wrap">
		<div class="row wrap">
			<div class="column inline">
				<h3 class="row inline">
					<label for="hasFirewall">
						Firewall
					</label>
				</h3>

				<p>Specify which IP addresses{nodeConfiguration.isOnchain ? ' and onchain addresses' : ''} can request execution of this container.</p>
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
						label: nodeConfiguration.isOnchain ? 'All IPs and addresses' : 'All IPs',
					},
					{
						value: true,
						label: nodeConfiguration.isOnchain ? 'Only allowed IPs and addresses' : 'Only allowed IPs',
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
							pattern={constraints?.allowed_ips?.pattern && `^${constraints.allowed_ips.pattern.replaceAll(/^[^]|[$]$/g, '')}(?:, ${constraints.allowed_ips.pattern.replaceAll(/^[^]|[$]$/g, '')})*$`}
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
							pattern={constraints?.allowed_addresses?.pattern && `^${constraints.allowed_addresses.pattern.replaceAll(/^[^]|[$]$/g, '')}(?:, ${constraints.allowed_addresses.pattern.replaceAll(/^[^]|[$]$/g, '')})*$`}
							disabled={!(hasFirewall && nodeConfiguration.isOnchain)}
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
							pattern={constraints?.allowed_delegate_addresses?.pattern && `^${constraints.allowed_delegate_addresses.pattern.replaceAll(/^[^]|[$]$/g, '')}(?:, ${constraints.allowed_delegate_addresses.pattern.replaceAll(/^[^]|[$]$/g, '')})*$`}
							disabled={!(hasFirewall && nodeConfiguration.isOnchain)}
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
					Start command
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
					Environment variables
				</label>

				<span class="annotation">Optional</span>
			</h3>

			<p>The .env file for this container. One variable per line.</p>
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

	<section class="column">
		<div class="column inline">
			<h3>
				<span>
					Rate limiting
				</span>
			</h3>

			<p>Control rate limiting parameters for the container's REST server.</p>
		</div>

		<div class="row equal">
			<div class="column">
				<div class="column inline">
					<div class="row inline">
						<label for="container.rate_limit_num_requests">
							Requests
						</label>

						<span class="annotation">Optional</span>
					</div>

					<p>Number of requests to allow per time period.</p>
				</div>

				<input
					type="number"
					placeholder="60"
					id="container.rate_limit_num_requests"
					name="container.rate_limit_num_requests"
					bind:value={container.rate_limit_num_requests}
					{...constraints?.rate_limit_num_requests}
				/>
			</div>

			<div class="column">
				<div class="column inline">
					<div class="row inline">
						<label for="container.rate_limit_period">
							Period
						</label>

						<span class="annotation">Optional</span>
					</div>

					<p>Number of seconds in a time period.</p>
				</div>

				<input
					type="number"
					placeholder="60.0"
					id="container.rate_limit_period"
					name="container.rate_limit_period"
					bind:value={container.rate_limit_period}
					step="0.1"
					{...constraints?.rate_limit_period}
				/>
			</div>
		</div>
	</section>

	{#if nodeConfiguration.isOnchain}
		<section class="stack">
			<fieldset
				class="column"
				disabled={!nodeConfiguration.isPaymentsEnabled}
			>
				<div class="row wrap">
					<div class="column inline">
						<h3 class="row inline">
							<label for="container.accepted_payments">
								Payments
							</label>

							<span class="annotation">Optional</span>
						</h3>

						<p>Accepted tokens and minimum payout amounts from subscriptions.</p>
					</div>

					<button
						type="button"
						class="small"
						on:click={() => {
							container.accepted_payments = [
								...(container.accepted_payments ?? []),
								{
									address: '',
									amount: undefined,
								},
							];
						}}
					>
						Add token
					</button>

					<p>If provided, subscriptions that don't meet these requirements will be skipped; otherwise, no payments will be received.</p>
				</div>

				<SizeTransition>
					<div class="column">
						{#each container.accepted_payments ?? [] as payment, i (i)}
							{@const selectedToken = (
								tokensByChainId[nodeConfiguration.chainId]
									?.find(token => token.address === payment.address)
							)}

							<div class="row token-payment">
								<div class="column inline">
									<label for="container.accepted_payments.{i}.address">
										Token Address
									</label>

									<TokenAddressCombobox
										id="container.accepted_payments.{i}.address"
										name="container.accepted_payments.{i}.address"
										bind:value={payment.address}
										tokens={
											nodeConfiguration.chainId in tokensByChainId
												? tokensByChainId[nodeConfiguration.chainId]
													.filter(token => (
														!new Set(
															container.accepted_payments?.map(payment => payment.address)
														)
															.has(token.address)
													))
												: undefined
										}
										required
										menuPlaceholder={
											nodeConfiguration.chainId in tokensByChainId ?
												undefined
											:
												`Select a chain ID first to see suggestions.`
										}
										class="code address-input"
									/>
								</div>

								<div class="column inline">
									<div class="row wrap">
										<label for="container.accepted_payments.{i}.amount">Minimum Payout</label>

										{#if selectedToken && payment.amount && (
											Math.log10(payment.amount) < selectedToken.decimals - 2
											|| Number(payment.amount) !== Math.floor(Number(payment.amount))
										)}
											<button
												type="button"
												class="smaller"
												on:click={() => {
													payment.amount = String(
														Number(payment.amount) === Math.floor(Number(payment.amount))
															? BigInt(payment.amount) * BigInt(Math.pow(10, selectedToken.decimals))
															: payment.amount * Math.pow(10, selectedToken.decimals)
													)
												}}
												transition:scale={{ duration: 200, easing: expoOut }}
											>
												× 10<sup>{selectedToken.decimals}</sup>
											</button>
										{/if}
									</div>

									<div class="row wrap">
										<input
											type="number"
											id="container.accepted_payments.{i}.amount"
											name="container.accepted_payments.{i}.amount"
											class="token-amount"
											value={payment.amount}
											on:input={e => { payment.amount = e.currentTarget.value }}
											placeholder="0"
											step="1"
											{...constraints?.accepted_payments?.amount}
										/>
									</div>
								</div>

								<div class="column inline">
									<span>&nbsp;</span>

									<button
										type="button"
										class="small destructive"
										on:click={() => {
											container.accepted_payments = container.accepted_payments.toSpliced(i, 1)
										}}
									>
										Delete
									</button>
								</div>
							</div>
						{/each}
					</div>
				</SizeTransition>
			</fieldset>

			<!-- {#if !nodeConfiguration.chainId}
				<div
					class="floating-status card row warning"
					transition:scale
				>
					<p>Specify a Chain ID at the node level first.</p>
				</div>
			{:else if !nodeConfiguration.isPaymentsEnabled} -->
			{#if !nodeConfiguration.isPaymentsEnabled}
				<div
					class="floating-status card row warning"
					transition:scale
				>
					{#if chainsByChainId.has(nodeConfiguration.chainId)}
						<img class="icon" src={chainsByChainId.get(nodeConfiguration.chainId)?.icon} />
					{/if}

					<p>Enable Payments at the node level first.</p>
				</div>
			{/if}
		</section>
	{/if}

	<!-- <div class="card column">
		<Collapsible
			open={hasAdvancedOptions}
		>
			<svelte:fragment slot="trigger">
				<header>
					Advanced
				</header>
			</svelte:fragment> -->

			<section class="column">
				<div class="row">
					<div class="column inline">
						<h3>
							<label for="container.generates_proofs">
								Generates proofs?
							</label>
						</h3>
		
						<p>Whether this container generates proofs. If disabled, the node will skip subscriptions that require proofs from this container.</p>
					</div>
		
					<Switch
						id="container.generates_proofs"
						name="container.generates_proofs"
						bind:checked={container.generates_proofs}
						labelText="Generate Payment Proofs?"
					/>
				</div>

				{#if container.generates_proofs}
					<div
						class="card warning row"
						data-before="⚠️"
					>
						<p>Note: <u>Wrong proofs can lead to slashing of your node's wallet</u>. Be sure to permission the node by configuring allowed Addresses and Delegate Addresses under Firewall.</p>
					</div>
				{/if}
			</section>
		<!-- </Collapsible>
	</div> -->
</fieldset>


<style>
	.token-payment {
		display: grid;
		grid-template-columns: 1.6fr 1fr auto;

		.token-amount {
			text-align: end;
		}
	}

	* :global(.address-input) {
		font-size: 0.75em;
		--input-paddingY: 0.75rem;
	}

	.floating-status {
		position: relative;
		place-self: center;
	}

	.icon {
		width: 1.5em;
		height: 1.5em;
	}
</style>
