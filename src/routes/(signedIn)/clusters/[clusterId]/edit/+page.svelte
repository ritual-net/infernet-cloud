<script lang="ts">
	// Types/constants
	import { providers, ProviderTypeEnum } from '$/types/provider'


	// Schema
	import { FormData } from './schema'


	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	const {
		cluster,
		formData,
	} = $page.data as PageData


	// Actions
	import { type Toast, addToast, removeToast } from '$/components/Toaster.svelte'


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
		delayed,
	} = superForm(formData, {
		dataType: 'json',
		customValidity: true,
		validators: yupClient(FormData),

		onResult: ({ result }) => {
			if(result.type === 'failure')
				addToast({
					data: {
						type: 'error',
						title: `Couldn't save cluster configuration.`,
						description: result.data && (result.data.result?.message ?? JSON.stringify(result.data.result)),
					},
				})
		},
	})

	export const snapshot = { capture, restore }

	let delayedToast: Toast
	$: if($delayed){
		delayedToast = addToast({
			data: {
				type: 'default',
				title: `Saving cluster...`,
			},
		})
	}else{
		if(delayedToast)
			removeToast(delayedToast.id)
	}

	let allowIps: 'all' | 'restricted' = 'all'


	// Functions
	import { resolveRoute } from '$app/paths'


	// Components
	import Tabs from '$/components/Tabs.svelte'
	import Select from '$/components/Select.svelte'
</script>


<form
	method="POST"
	use:enhance
	class="column"
>
	<header class="row">
		<legend>
			<h2>Edit Cluster</h2>
		</legend>
	</header>

	<div class="card column">
		<section class="row wrap">
			<h3>
				Service Account
			</h3>

			<div class="row">
				<img class="icon" src={providers[cluster.service_account.provider].icon} />
				{cluster.service_account.name}
			</div>
		</section>

		<section class="row wrap">
			<div class="column inline">
				<h3 class="row inline">
					<label for="config.name">
						Cluster name
					</label>
				</h3>

				<p>Give your cluster a human-readable name.</p>
			</div>

			<input
				type="text"
				id="config.name"
				name="config.name"
				placeholder="my-cluster-1"
				bind:value={$form.config.name}
				{...$constraints.config?.name}
			/>
		</section>

		<section class="column wrap">
			<div class="row wrap">
				<div class="column inline">
					<h3 class="row inline">
						<label for="allowIps">
							Firewall
						</label>
					</h3>

					<p>Determine which IP addresses will have permissions to this cluster.</p>
				</div>

				<Select
					required
					id="allowIps"
					name="allowIps"
					labelText="Firewall"
					bind:value={allowIps}
					items={[
						{
							value: 'all',
							label: 'All IPs',
						},
						{
							value: 'restricted',
							label: 'Only allowed IPs',
						}
					]}
				/>
			</div>

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
								id="config.ip_allow_http"
								name="config.ip_allow_http"
								rows="2"
								placeholder={`Enter a comma-separated list of IP addresses...\n0.0.0.0/1, 0.0.0.0/2`}
								bind:value={$form.config.ip_allow_http}
								{...$constraints.config?.ip_allow_http}
								disabled={allowIps === 'all'}
							/>

						{:else}
							<textarea
								id="config.ip_allow_ssh"
								name="config.ip_allow_ssh"
								rows="2"
								placeholder={`Enter a comma-separated list of IP addresses...\n0.0.0.0/1, 0.0.0.0/2`}
								bind:value={$form.config.ip_allow_ssh}
								{...$constraints.config?.ip_allow_ssh}
								disabled={allowIps === 'all'}
							/>
						{/if}
					</svelte:fragment>
				</Tabs>
			{/if}
		</section>
	</div>

	<footer class="row">
		<a
			class="button"
			href={resolveRoute(`/clusters/[clusterId]`, {
				clusterId: $page.params.clusterId,
			})}
		>
			Cancel
		</a>

		<button
			type="submit"
			class="primary"
		>
			Save Changes
		</button>
	</footer>
</form>


<style>
	.icon {
		width: 1.5em;
		height: 1.5em;
	}
</style>
