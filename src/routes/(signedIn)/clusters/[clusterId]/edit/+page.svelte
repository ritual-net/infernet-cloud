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


	// (Firewall)
	let httpFirewallMode: 'all' | 'allowlist' | 'none' = (
		!$form.config.ip_allow_http || $form.config.ip_allow_http.length === 1 && $form.config.ip_allow_http[0] === '0.0.0.0/0' ?
			'all'
		: $form.config.ip_allow_http.length > 0 ?
			'allowlist'
		:
			'none'
	)
	let sshFirewallMode: 'all' | 'allowlist' | 'none' = (
		!$form.config.ip_allow_ssh || $form.config.ip_allow_ssh.length === 1 && $form.config.ip_allow_ssh[0] === '0.0.0.0/0' ?
			'all'
		: $form.config.ip_allow_ssh.length > 0 ?
			'allowlist'
		:
			'none'
	)

	let httpAllowlist = $form.config.ip_allow_http ?? []
	let sshAllowlist = $form.config.ip_allow_ssh ?? []

	$: $form.config.ip_allow_http = (
		httpFirewallMode === 'all' ?
			undefined
		: httpFirewallMode === 'allowlist' ?
			httpAllowlist
		: httpFirewallMode === 'none' ?
			[]
		:
			undefined
	)
	$: $form.config.ip_allow_ssh = (
		sshFirewallMode === 'all' ?
			undefined
		: sshFirewallMode === 'allowlist' ?
			sshAllowlist
		: sshFirewallMode === 'none' ?
			[]
		:
			undefined
	)


	// Functions
	import { resolveRoute } from '$app/paths'
	import { parseCommaSeparated, serializeCommaSeparated } from '$/lib/utils/commaSeparated'


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import Select from '$/components/Select.svelte'
	import Textarea from '$/components/Textarea.svelte'
	import Switch from '$/components/Switch.svelte'
	import RegionZoneMachineFields from '../../create/RegionZoneMachineFields.svelte'
</script>


<svelte:head>
	<title>Edit Cluster | {cluster.name || cluster.id} | Cluster | Infernet Cloud</title>
</svelte:head>


<form
	method="POST"
	use:enhance
	class="column"
>
	<header class="row">
		<legend>
			<h2>Edit cluster</h2>
		</legend>
	</header>

	<div class="card column">
		<section class="row wrap">
			<h3>
				Cloud account
			</h3>

			<div class="row inline with-icon">
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
			<h3>Firewall</h3>
			
			<div class="row equal align-start wrap">
				<div class="column">
					<div class="column inline">
						<h4>
							<label for="hasHttpFirewall">
								HTTP
							</label>
						</h4>

						<p>Specify which IPs can make HTTP requests to this cluster.</p>
					</div>

					<Select
						required
						id="hasHttpFirewall"
						name="hasHttpFirewall"
						labelText="HTTP Firewall"
						bind:value={httpFirewallMode}
						items={[
							{
								value: 'all',
								label: 'All IPs',
							},
							{
								value: 'allowlist',
								label: 'Only allowed IPs',
							},
							{
								value: 'none',
								label: 'None (disabled)',
							}
						]}
					/>

					{#if httpFirewallMode === 'allowlist'}
						<Textarea
							id="config.ip_allow_http"
							name="config.ip_allow_http"
							rows="2"
							placeholder={`Comma-separated IPv4 addresses / CIDR blocks...\n0.0.0.0/1, 0.0.0.0/2`}
							value={serializeCommaSeparated(httpAllowlist)}
							onblur={e => { httpAllowlist = parseCommaSeparated(e.currentTarget.value) }}
							{...$constraints.config?.ip_allow_http}
							pattern={$constraints?.config?.ip_allow_http?.pattern && `^${$constraints.config.ip_allow_http.pattern.replaceAll(/^[^]|[$]$/g, '')}(?:, ${$constraints.config.ip_allow_http.pattern.replaceAll(/^[^]|[$]$/g, '')})*$`}
							class="small"
						/>
					{/if}
				</div>

				<div class="column">
					<div class="column inline">
						<h4>
							<label for="hasSshFirewall">
								SSH
							</label>
						</h4>

						<p>Specify which IPs can connect to this cluster via SSH.</p>
					</div>

					<Select
						required
						id="hasSshFirewall"
						name="hasSshFirewall"
						labelText="SSH Firewall"
						bind:value={sshFirewallMode}
						items={[
							{
								value: 'all',
								label: 'All IPs',
							},
							{
								value: 'allowlist',
								label: 'Only allowed IPs',
							},
							{
								value: 'none',
								label: 'None (disabled)',
							},
						]}
					/>

					{#if sshFirewallMode === 'allowlist'}
						<Textarea
							id="config.ip_allow_ssh"
							name="config.ip_allow_ssh"
							rows="2"
							placeholder={`Comma-separated IPv4 addresses / CIDR blocks...\n0.0.0.0/1, 0.0.0.0/2`}
							value={serializeCommaSeparated(sshAllowlist)}
							onblur={e => { sshAllowlist = parseCommaSeparated(e.currentTarget.value) }}
							{...$constraints.config?.ip_allow_ssh}
							pattern={$constraints?.config?.ip_allow_ssh?.pattern && `^${$constraints.config.ip_allow_ssh.pattern.replaceAll(/^[^]|[$]$/g, '')}(?:, ${$constraints.config.ip_allow_ssh.pattern.replaceAll(/^[^]|[$]$/g, '')})*$`}
							class="small"
						/>
					{/if}
				</div>
			</div>
		</section>

		<fieldset
			class="column"
		>
			<RegionZoneMachineFields
				entityType="cluster"
				namePrefix="config"
				serviceAccount={cluster.service_account}
				bind:regionId={$form.config.region}
				bind:zoneId={$form.config.zone}
				constraints={{
					region: $constraints.config?.region,
					zone: $constraints.config?.zone,
				}}
			/>
		</fieldset>
	</div>

	<div class="card column">
		<div class="card column">
			<section class="row wrap">
				<div class="column inline">
					<h3>
						<label for="config.deploy_router">
							Deploy Router?
						</label>
					</h3>

					<p>Determine whether your cluster will be deployed with an <a href="https://docs.ritual.net/infernet/router/introduction" target="_blank">Infernet Router</a>.</p>
				</div>

				<Switch
					id="config.deploy_router"
					name="config.deploy_router"
					bind:checked={$form.config.deploy_router}
					labelText="Deploy Router?"
				/>
			</section>

			<Collapsible
				open={$form.config.deploy_router}
			>	
				<RegionZoneMachineFields
					entityType="router"
					namePrefix="router"
					serviceAccount={cluster.service_account}
					defaults={{
						region: $form.config.region,
						zone: $form.config.zone,
					}}
					bind:regionId={$form.router.region}
					bind:zoneId={$form.router.zone}
					bind:machineId={$form.router.machine_type}
					bind:machineImageId={$form.router.machine_image}
					constraints={$constraints.router}
				/>
			</Collapsible>
		</div>

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
			disabled={$submitting}
		>
			Save and apply changes
		</button>
	</footer>
</form>


<style>
	.icon {
		width: 1.5em;
		height: 1.5em;
	}
</style>
