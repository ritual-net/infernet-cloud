<script lang="ts">
	// Types/constants
	import type { InputConstraints } from 'sveltekit-superforms'
	import type { ServiceAccount } from '$schema/interfaces'
	import * as z from 'yup'
	import { chainsByChainId } from '$/lib/chains'
	import { infernetDeployments } from '$/lib/infernet-sdk'


	// Schema
	import { Node } from './schema'


	// Context
	import { page } from '$app/stores'


	// Functions
	import { createPublicClient, http } from 'viem'
	import { getChainId } from 'viem/actions'


	// Inputs
	export let node: z.InferType<typeof Node>
	export let namePrefix = 'node'
	export let constraints: InputConstraints<z.InferType<typeof Node>> | undefined

	export let defaultRegionId: string | undefined
	export let defaultZoneId: string | undefined

	export let serviceAccount: ServiceAccount | undefined
	export let dockerAccounts: {
		username: string
	}[]


	// Internal state
	// (GPU)
	let hasGpu: boolean = false


	// (Chain)
	import { createQuery } from '@tanstack/svelte-query'

	$: chainIdQuery = createQuery({
		queryKey: ['ChainId', {
			rpcUrl: node.config.rpc_url,
		}] as const,
		queryFn: async ({
			queryKey: [_, {
				rpcUrl,
			}],
		}) => {
			if(!rpcUrl) return undefined

			if(!URL.canParse(rpcUrl)) return undefined
			
			const client = createPublicClient({ 
				transport: http(rpcUrl),
			})
			
			return await getChainId(client)
		},
		select: result => {
			node.config.chain_id = result
			return result
		}
	})

	$: if(chainIdQuery && $chainIdQuery.data) (async () => {
		node.config.chain_id = $chainIdQuery.data
	})()


	// (Payments)
	let isPaymentsEnabled = (
		Boolean(node.config.chain_enabled && node.config.payment_address)
	)


	// (Containers)
	$: containerCreateRoute = new URL(
		`/clusters/create/container?${new URLSearchParams({
			...hasGpu && {
				hasGpu: 'true',
			},
			...node.config.chain_enabled && {
				isOnchain: 'true',
				chainId: node.config.chain_id?.toString(),
				...isPaymentsEnabled && {
					isPaymentsEnabled: 'true',
				},
			},
			...node.dockerAccountUsername && {
				dockerAccountUsername: node.dockerAccountUsername,
			},
		})}`,
		$page.url
	).toString()


	// Functions
	import { isTruthy } from '$/lib/utils/isTruthy'


	// Actions
	import { addToast, removeToast } from '$/components/Toaster.svelte'


	// Components
	import ChainCombobox from '$/views/ChainCombobox.svelte'
	import Combobox from '$/components/Combobox.svelte'
	import Collapsible from '$/components/Collapsible.svelte'
	import Dialog from '$/components/Dialog.svelte'
	import Switch from '$/components/Switch.svelte'
	import Select from '$/components/Select.svelte'
	import NodeContainersTable from './NodeContainersTable.svelte'
	import ContainerForm from './container/+page.svelte'
	import Textarea from '$/components/Textarea.svelte'
	import RegionZoneMachineFields from './RegionZoneMachineFields.svelte'
	import { DockerIcon } from '$/icons'


	// Shallow Routes
	import { preloadData, goto, pushState } from '$app/navigation'
</script>


<RegionZoneMachineFields
	entityType="node"
	namePrefix={namePrefix}
	{serviceAccount}
	defaults={{
		region: defaultRegionId,
		zone: defaultZoneId,
	}}
	bind:regionId={node.config.region}
	bind:zoneId={node.config.zone}
	bind:machineId={node.config.machine_type}
	bind:machineImageId={node.config.machine_image}
	bind:hasGpu
	constraints={{
		region: constraints?.config?.region,
		zone: constraints?.config?.zone,
		machine_type: constraints?.config?.machine_type,
		machine_image: constraints?.config?.machine_image,
	}}
/>

<section class="row">
	<div class="column inline">
		<h3>
			<label for="{namePrefix}.config.chain_enabled">
				Onchain?
			</label>
		</h3>

		<p>Whether this node will listen and respond to onchain events, and optionally accept payments from subscriptions.</p>
	</div>

	<Switch
		id="{namePrefix}.config.chain_enabled"
		name="{namePrefix}.config.chain_enabled"
		bind:checked={node.config.chain_enabled}
		labelText="Onchain?"
	/>
</section>

<Collapsible open={node.config.chain_enabled}>
	<fieldset
		class="column"
		disabled={!node.config.chain_enabled}
	>
		<section class="column">
			<div class="column inline">
				<h3>Chain configuration</h3>
			</div>

			<div class="row equal wrap">
				<div class="column">
					<div class="column inline">
						<div class="row inline">
							<label for="{namePrefix}.config.rpc_url">JSON-RPC URL</label>
						</div>

						<p>HTTP(S). Must support the <a href="https://ethereum.org/en/developers/docs/apis/json-rpc#eth_newfilter" target="_blank"><code>eth_newFilter</code></a> method.</p>
					</div>

					<input
						type="url"
						placeholder="https://rpc.example.com/rpc"
						id="{namePrefix}.config.rpc_url"
						name="{namePrefix}.config.rpc_url"
						bind:value={node.config.rpc_url}
						{...constraints?.config?.rpc_url}
					/>
				</div>

				<div class="column">
					<div class="column inline">
						<div class="row inline">
							<label for="{namePrefix}|chainId">
								Chain ID
							</label>
						</div>

						<p>The chain ID of the EVM-based network to connect to.</p>
					</div>
	
					<ChainCombobox
						id="{namePrefix}|chain_id"
						name="{namePrefix}|chain_id"
						bind:chainId={node.config.chain_id}
					/>
				</div>

				<div class="column">
					<div class="column inline">
						<label for="{namePrefix}.config.registry_address">
							Registry address
						</label>

						<p>The address of the <a href="https://docs.ritual.net/infernet/sdk/reference/Registry" target="_blank">Infernet SDK Registry</a> smart contract.</p>
					</div>

					<Combobox
						labelText="Registry Address"
						placeholder="0xabcdef...1234567890"
						id="{namePrefix}.config.registry_address"
						name="{namePrefix}.config.registry_address"
						class="code address-input"
						bind:value={node.config.registry_address}
						{...constraints?.config?.registry_address}
						items={
							Array.from(
								Map.groupBy(
									infernetDeployments,
									deployment => deployment.chainId
								)
									.entries(),
								([chainId, deployments]) => ({
									value: chainId,
									label: chainsByChainId.get(chainId)?.name ?? chainId,
									items: deployments.map(deployment => ({
										value: deployment.contracts['Registry'].address,
										label: `${chainsByChainId.get(chainId)?.name ?? chainId} › Infernet SDK ${deployment.version} › Registry`, 
										icon: chainsByChainId.get(chainId)?.icon,
									})),
								})
							)
								.filter(group => (
									node.config.chain_id
										? group.value === node.config.chain_id
										: true
								))
						}
					/>
				</div>

				<div class="column">
					<div class="column inline">
						<span class="row inline">
							<label for="{namePrefix}.config.trail_head_blocks">
								Trail head blocks
							</label>
	
							<span class="annotation">Optional</span>
						</span>	
					</div>

					<p><a href="https://docs.ritual.net/infernet/node/configuration/v1_3_0#trail_head_blocks-integer" target="_blank">Number of blocks</a> to delay chain syncing. Added latency may help avoid failed transactions due to reorganizations.</p>
	
					<input
						type="number"
						placeholder={`${5}`}
						id="{namePrefix}.config.trail_head_blocks"
						name="{namePrefix}.config.trail_head_blocks"
						bind:value={node.config.trail_head_blocks}
						{...constraints?.config?.trail_head_blocks}
					/>
				</div>
			</div>
		</section>

		<section class="column">
			<div class="column inline">
				<h3>Wallet and transactions</h3>
			</div>

			<div class="row equal wrap">
				<div class="column">
					<div class="column inline">
						<div class="row inline">
							<label for="{namePrefix}.config.private_key">
								Private key
							</label>
						</div>

						<p>The <code>0x</code>-prefixed private key for the node's wallet.</p>
					</div>

					<input
						type="password"
						placeholder="0xabcdef...1234567890"
						autocomplete="off"
						id="{namePrefix}.config.private_key"
						name="{namePrefix}.config.private_key"
						bind:value={node.config.private_key}
						{...constraints?.config?.private_key}
						class="code"
					/>
				</div>

				<div class="column">
					<div class="column inline">
						<div class="row inline">
							<label for="{namePrefix}.config.max_gas_limit">
								Max gas limit
							</label>

							<span class="annotation">Optional</span>
						</div>

						<p>Maximum gas units to spend when sending a transaction.</p>
					</div>

					<input
						type="number"
						placeholder={`${5000000}`}
						id="{namePrefix}.config.max_gas_limit"
						name="{namePrefix}.config.max_gas_limit"
						bind:value={node.config.max_gas_limit}
						{...constraints?.config?.max_gas_limit}
					/>
				</div>
			</div>

			<div class="column">
				<div class="column inline">
					<h4 class="row inline">
						<label for="{namePrefix}.config.allowed_sim_errors">
							Ignored errors
						</label>

						<span class="annotation">Optional</span>
					</h4>

					<p>
						Substrings of error messages to ignore when simulating transactions. Case-insensitive; one per line.
						<br>
						For example, <code>"out of gas"</code> matches <code>"Contract reverted: Out of gas"</code>.
					</p>
				</div>

				<Textarea
					id="{namePrefix}.config.allowed_sim_errors"
					name="{namePrefix}.config.allowed_sim_errors"
					rows="2"
					placeholder={`Enter one string per line...\nout of gas`}
					value={node.config.allowed_sim_errors?.join('\n')}
					onblur={e => { node.config.allowed_sim_errors = e.currentTarget.value.split('\n').map(item => item.trim()) }}
					{...constraints?.config?.allowed_sim_errors}
					disabled={!node.config.chain_enabled}
					class="code"
				/>
			</div>
		</section>

		<section class="column">
			<div class="row">
				<div class="column inline">
					<h3 class="row inline">
						<label for="{namePrefix}|isPaymentsEnabled">
							Accept payments?
						</label>
					</h3>

					<p>Whether to accept payments from subscriptions.</p>
				</div>

				<Switch
					id="{namePrefix}|isPaymentsEnabled"
					name="{namePrefix}|isPaymentsEnabled"
					bind:checked={isPaymentsEnabled}
					on:change={e => {
						node.config.payment_address = undefined
					}}
					labelText="Accept Payments?"
				/>
			</div>

			<Collapsible open={isPaymentsEnabled}>
				<fieldset
					class="column"
					disabled={!isPaymentsEnabled}
				>
					<div class="row wrap">
						<div class="column inline">
							<div class="row inline">
								<label for="{namePrefix}.config.payment_address">
									Payment address
								</label>
							</div>

							<p>The address to send payments to.</p>
						</div>

						<input
							type="text"
							placeholder="0xabcdef...1234567890"
							id="{namePrefix}.config.payment_address"
							name="{namePrefix}.config.payment_address"
							bind:value={node.config.payment_address}
							{...constraints?.config?.payment_address}
							required={isPaymentsEnabled}
							class="code address-input"
						/>
					</div>
				</fieldset>
			</Collapsible>
		</section>

		<section class="column">
			<div class="column inline">
				<h3>
					<span>
						Snapshot syncing
					</span>
				</h3>

				<p>Control rate limiting parameters for RPC communication.</p>
			</div>

			<div class="row equal wrap">
				<div class="column">
					<div class="column inline">
						<div class="row inline">
							<label for="{namePrefix}.config.snapshot_sync_sleep">
								Sleep duration
							</label>

							<span class="annotation">Optional</span>
						</div>

						<p>Number of seconds to sleep between snapshots.</p>
					</div>

					<input
						type="number"
						placeholder={`${1.0}`}
						id="{namePrefix}.config.snapshot_sync_sleep"
						name="{namePrefix}.config.snapshot_sync_sleep"
						bind:value={node.config.snapshot_sync_sleep}
						step="0.1"
						{...constraints?.config?.snapshot_sync_sleep}
					/>
				</div>

				<div class="column">
					<div class="column inline">
						<div class="row inline">
							<label for="{namePrefix}.config.snapshot_sync_batch_size">
								Batch size
							</label>

							<span class="annotation">Optional</span>
						</div>

						<p>Number of subscriptions to sync per batch.</p>
					</div>

					<input
						type="number"
						placeholder={`${200}`}
						id="{namePrefix}.config.snapshot_sync_batch_size"
						name="{namePrefix}.config.snapshot_sync_batch_size"
						bind:value={node.config.snapshot_sync_batch_size}
						{...constraints?.config?.snapshot_sync_batch_size}
					/>
				</div>

				<div class="column">
					<div class="column inline">
						<div class="row inline">
							<label for="{namePrefix}.config.snapshot_sync_starting_sub_id">
								Starting subscription
							</label>

							<span class="annotation">Optional</span>
						</div>

						<p>Subscription ID to start the syncing process from.</p>
					</div>

					<input
						type="number"
						placeholder="0"
						id="{namePrefix}.config.snapshot_sync_starting_sub_id"
						name="{namePrefix}.config.snapshot_sync_starting_sub_id"
						bind:value={node.config.snapshot_sync_starting_sub_id}
						{...constraints?.config?.snapshot_sync_starting_sub_id}
					/>
				</div>

				<div class="column">
					<div class="column inline">
						<div class="row inline">
							<label for="{namePrefix}.config.sync_period">
								Sync period
							</label>

							<span class="annotation">Optional</span>
						</div>

						<p>Number of seconds to poll chain for blocks/subscriptions.</p>
					</div>

					<input
						type="number"
						placeholder="0.5"
						id="{namePrefix}.config.snapshot_sync_sync_period"
						name="{namePrefix}.config.snapshot_sync_sync_period"
						bind:value={node.config.snapshot_sync_sync_period}
						step="0.1"
						{...constraints?.config?.snapshot_sync_sync_period}
					/>
				</div>
			</div>
		</section>
	</fieldset>
</Collapsible>

<section class="row">
	<div class="column inline">
		<h3 class="row inline">
			<label for="{namePrefix}.config.forward_stats">
				Forward stats?
			</label>
		</h3>

		<p>Register this node with <a href="https://infernet.ritual.net" target="_blank">Infernet Explorer</a> to let anyone browse resource usage, containers and fulfilled jobs.</p>
	</div>

	<Switch
		id="{namePrefix}.config.forward_stats"
		name="{namePrefix}.config.forward_stats"
		bind:checked={node.config.forward_stats}
		labelText="Forward stats?"
	/>
</section>

<section class="row wrap">
	<div class="column inline">
		<h3 class="row inline">
			<label for="{namePrefix}.dockerAccountUsername">
				Docker Hub account
			</label>

			<span class="annotation">Optional</span>
		</h3>

		<p><a href="/cloud-accounts/docker/connect" target="_blank">Connect</a> your Docker Hub account to allow the node to access private Docker images.</p>
	</div>

	<Select
		id="{namePrefix}.dockerAccountUsername"
		name="{namePrefix}.dockerAccountUsername"
		labelText="Docker Hub username"
		bind:value={node.dockerAccountUsername}
		{...!dockerAccounts
			? {
				placeholder: 'Loading...',
				items: (
					[
						{
							value: '',
							label: 'None'
						},
						node.dockerAccountUsername && {
							value: node.dockerAccountUsername,
							label: node.dockerAccountUsername,
						}
					]
						.filter(isTruthy)
				),
				loading: true,
				visuallyDisabled: true,
			}
			: {
				placeholder: 'Choose user...',
				items: [
					{
						value: '',
						label: 'None'
					},
					...dockerAccounts.map(dockerAccount => ({
						value: dockerAccount.username,
						label: dockerAccount.username,
						icon: DockerIcon,
					}))
				],
				disabled: dockerAccounts.length === 0,
			}
		}
		{...constraints?.dockerAccountUsername}
	/>
</section>

<section class="column">
	<div class="row">
		<div class="column inline">
			<h3>
				Containers
			</h3>

			<p>Configure containers and services to run on this node.</p>
		</div>

		<a
			class="button primary"
			href={containerCreateRoute}
			data-sveltekit-preload-code="eager"
			data-sveltekit-preload-data="hover"

			on:click={async (e) => {
				e.preventDefault()

				const { currentTarget } = e

				if(currentTarget.getAttribute('aria-disabled') === 'true') return

				const { href } = currentTarget

				currentTarget.setAttribute('aria-disabled', 'true')

				const loadingToast = addToast({
					data: {
						title: 'Loading container form...',
					},
				})

				const result = await preloadData(href)

				currentTarget.removeAttribute('aria-disabled')

				if (result.type === 'loaded' && result.status === 200) {
					pushState('#/container/create', {
						showContainerForm: 'create',
						nodeId: node.id,
						pageData: {
							...result.data,
							imagesPromise: await result.data.imagesPromise,
							containerTemplatesPromise: await result.data.containerTemplatesPromise,
						},
					})
				} else {
					console.error(`Failed to preload shallow route: ${href}`)
					goto(href)
				}

				removeToast(loadingToast.id)
			}}
		>
			Add container
		</a>
	</div>

	<NodeContainersTable
		bind:containers={node.containers}
		onEdit={async container => {
			const href = containerCreateRoute

			const result = await preloadData(href)

			if (result.type === 'loaded' && result.status === 200) {
				pushState('#/container/edit', {
					showContainerForm: 'edit',
					nodeId: node.id,
					containerId: container.id ?? undefined,
					pageData: {
						...result.data,
						imagesPromise: await result.data.imagesPromise,
						containerTemplatesPromise: await result.data.containerTemplatesPromise,
						formData: {
							container,
						},
					},
				})
			} else {
				console.error(`Failed to preload shallow route: ${href}`)
				goto(href)
			}
		}}
	/>

	<Dialog
		title={`Customize container`}
		open={Boolean($page.state.showContainerForm) && $page.state.nodeId === node.id}
		onClose={() => {
			history.back()
		}}
	>
		<ContainerForm
			data={$page.state.pageData}
			mode={$page.state.showContainerForm}
			{...(
				$page.state.showContainerForm === 'create' ?
				// $page.url.hash === '#/container/create' ?
					{
						submitLabel: 'Add container',

						onSubmit: ({ container }) => {
							node.containers.push(container)
							node.containers = node.containers

							history.back()
						},
					}
				: $page.state.showContainerForm === 'edit' ?
				// : $page.url.hash === '#/container/edit' ?
					{
						submitLabel: 'Save changes',

						onSubmit: ({ container }) => {
							node.containers[
								node.containers.findIndex(container => container.id === $page.state.containerId)
							] = container
							node.containers = node.containers

							history.back()
						},
					}
				:
					{}
			)}
			onCancel={() => {
				history.back()
			}}
			placement={'in-modal'}
		/>
	</Dialog>
</section>


<style>
	* :global(.address-input) {
		font-size: 0.75em;
		--input-paddingY: 0.75rem;
	}
</style>
