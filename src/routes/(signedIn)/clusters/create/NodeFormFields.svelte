<script lang="ts">
	// Types/constants
	import type { InputConstraints } from 'sveltekit-superforms'
	import * as z from 'yup'


	// Schema
	import { Node } from './schema'


	// Context
	import { page } from '$app/stores'


	// Inputs
	export let node: z.InferType<typeof Node>
	export let namePrefix = 'node'
	export let constraints: InputConstraints<z.InferType<typeof Node>> | undefined

	export let dockerAccounts: {
		username: string
	}[]


	// Internal state
	$: containerCreateRoute = new URL(
		`/clusters/create/container?${new URLSearchParams({
			...node.dockerAccountUsername && {
				dockerAccountUsername: node.dockerAccountUsername,
			},
			...node.config.chain_enabled && {
				isOnchain: 'true',
			},
		})}`,
		$page.url
	).toString()


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import Dialog from '$/components/Dialog.svelte'
	import Switch from '$/components/Switch.svelte'
	import Select from '$/components/Select.svelte'
	import NodeContainersTable from './NodeContainersTable.svelte'
	import ContainerForm from './container/+page.svelte'


	// Shallow Routes
	import { preloadData, goto, pushState } from '$app/navigation'
</script>


<section class="row wrap">
	<div class="column inline">
		<h3>
			<label for="{namePrefix}.config.chain_enabled">
				Onchain?
			</label>
		</h3>

		<p>Determines if the node is listening to Ritual chain for events, or whether it is latent.</p>
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
		<section class="row wrap">
			<div class="column inline">
				<h3 class="row inline">
					<label for="{namePrefix}.config.rpc_url">
						RPC URL
					</label>
				</h3>

				<p>The Ethereum node RPC URL.</p>
			</div>

			<input
				type="url"
				placeholder="https://rpc.example.com/rpc"
				id="{namePrefix}.config.rpc_url"
				name="{namePrefix}.config.rpc_url"
				bind:value={node.config.rpc_url}
				{...constraints?.config?.rpc_url}
			/>
		</section>

		<section class="row wrap">
			<div class="column inline">
				<h3 class="row inline">
					<label for="{namePrefix}.config.coordinator_address">
						Coordinator Address
					</label>
				</h3>

				<p>The address of the Coordinator smart contract.</p>
			</div>

			<input
				type="text"
				placeholder="0xabcdef...1234567890"
				id="{namePrefix}.config.coordinator_address"
				name="{namePrefix}.config.coordinator_address"
				bind:value={node.config.coordinator_address}
				{...constraints?.config?.coordinator_address}
			/>
		</section>

		<section class="row wrap">
			<div class="column inline">
				<h3 class="row inline">
					<label for="{namePrefix}.config.trail_head_blocks">
						Trail Head Blocks
					</label>

					<span class="annotation">Optional</span>
				</h3>

				<p>The number of blocks.</p>
			</div>

			<input
				type="number"
				placeholder="{5}"
				id="{namePrefix}.config.trail_head_blocks"
				name="{namePrefix}.config.trail_head_blocks"
				bind:value={node.config.trail_head_blocks}
				{...constraints?.config?.trail_head_blocks}
			/>
		</section>

		<section class="row wrap">
			<div class="column inline">
				<h3 class="row inline">
					<label for="{namePrefix}.config.max_gas_limit">
						Max Gas Limit
					</label>

					<span class="annotation">Optional</span>
				</h3>

				<p>The threshold to trigger an Ethereum transaction in gwei.</p>
			</div>

			<input
				type="number"
				placeholder="{5000000}"
				id="{namePrefix}.config.max_gas_limit"
				name="{namePrefix}.config.max_gas_limit"
				bind:value={node.config.max_gas_limit}
				{...constraints?.config?.max_gas_limit}
			/>
		</section>

		<section class="row wrap">
			<div class="column inline">
				<h3 class="row inline">
					<label for="{namePrefix}.config.private_key">
						Private Key
					</label>
				</h3>

				<p>The private key of the node.</p>
			</div>

			<input
				type="password"
				placeholder="0xabcdef...1234567890"
				id="{namePrefix}.config.private_key"
				name="{namePrefix}.config.private_key"
				bind:value={node.config.private_key}
				{...constraints?.config?.private_key}
				class="code"
			/>
		</section>

		<section class="column">
			<div class="column inline">
				<h3>
					<span>
						Snapshot Syncing
					</span>
				</h3>

				<p>Control rate limiting parameters for RPC communication.</p>
			</div>

			<div class="row equal">
				<div class="column">
					<div class="column inline">
						<div class="row inline">
							<label for="{namePrefix}.config.snapshot_sync_sleep">Sleep Duration</label>

							<span class="annotation">Optional</span>
						</div>

						<p>Number of seconds to sleep between snapshots.</p>
					</div>
	
					<input
						type="number"
						placeholder="1.0"
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
							<label for="{namePrefix}.config.snapshot_sync_batch_size">Batch Size</label>

							<span class="annotation">Optional</span>
						</div>

						<p>Number of subscriptions to sync per batch.</p>
					</div>
	
					<input
						type="number"
						placeholder="200"
						id="{namePrefix}.config.snapshot_sync_batch_size"
						name="{namePrefix}.config.snapshot_sync_batch_size"
						bind:value={node.config.snapshot_sync_batch_size}
						{...constraints?.config?.snapshot_sync_batch_size}
					/>
				</div>
			</div>
		</section>
	</fieldset>
</Collapsible>

<section class="row wrap">
	<div class="column inline">
		<h3 class="row inline">
			<label for="{namePrefix}.config.forward_stats">
				Forward Stats?
			</label>
		</h3>

		<p>If checked, register this node to be shown publicly on the Infernet explorer.</p>
	</div>

	<Switch
		id="{namePrefix}.config.forward_stats"
		name="{namePrefix}.config.forward_stats"
		bind:checked={node.config.forward_stats}
		labelText="Forward Stats?"
	/>
</section>

<section class="row wrap">
	<div class="column inline">
		<h3 class="row inline">
			<label for="{namePrefix}.dockerAccountUsername">
				Docker Hub Account
			</label>

			<span class="annotation">Optional</span>
		</h3>

		<p><a href="/cloud-accounts/docker/connect">Connect your Docker Hub account</a> to allow the node to access private Docker images.</p>
	</div>

	<Select
		id="{namePrefix}.dockerAccountUsername"
		name="{namePrefix}.dockerAccountUsername"
		labelText="Docker Hub Username"
		bind:value={node.dockerAccountUsername}
		{...!dockerAccounts
			? {
				placeholder: 'Loading...',
				items: [
					{
						value: '',
						label: 'None'
					},
					node.dockerAccountUsername && {
						value: node.dockerAccountUsername,
						label: node.dockerAccountUsername,
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
		{...constraints?.dockerAccountUsername}
	/>
</section>

<section class="column">
	<div class="row">
		<div class="column inline">
			<h3>
				Containers
			</h3>

			<p>Assign new or existing container configurations to this node.</p>
		</div>

		<a
			class="button primary"
			href={containerCreateRoute}
			data-sveltekit-preload-code="eager"

			on:click={async (e) => {
				e.preventDefault()

				const { href } = e.currentTarget

				const result = await preloadData(href)

				if (result.type === 'loaded' && result.status === 200) {
					pushState('#/container/create', {
						showContainerForm: 'create',
						nodeId: node.id,
						pageData: {
							...result.data,
							imagesPromise: await result.data.imagesPromise,
						},
					})
				} else {
					console.error(`Failed to preload shallow route: ${href}`)
					goto(href)
				}
			}}
		>
			Add Container
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
					containerId: container.id,
					pageData: {
						...result.data,
						imagesPromise: await result.data.imagesPromise,
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
						submitLabel: 'Add Container',

						onSubmit: ({ container }) => {
							node.containers.push(container)
							node.containers = node.containers

							history.back()
						},
					}
				: $page.state.showContainerForm === 'edit' ?
				// : $page.url.hash === '#/container/edit' ?
					{
						submitLabel: 'Save Changes',

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
