<script lang="ts">
	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	$: ({
		containerTemplate,
	} = $page.data as PageData)


	// Functions
	import { serializeEnvObject } from '$/lib/utils/env'


	// Actions
	import { applyAction } from '$app/forms'
	import { goto, invalidate } from '$app/navigation'
	import { addToast, removeToast } from '$/components/Toaster.svelte'


	// Components
	import RitualLogo from '$/icons/RitualLogo.svelte'
	import DropdownMenu from '$/components/DropdownMenu.svelte'
</script>


<div class="container column">
	<header class="row wrap">
		<div class="row">
			<div
				class="icon"
			>
				<RitualLogo />
			</div>

			<div class="column inline">
				<h2>
					{containerTemplate.name}
				</h2>

				<p>Container Template</p>
			</div>
		</div>

		<div class="row">
			<DropdownMenu
				labelText="Container Template Actions"
				items={[
					{
						value: 'duplicate',
						label: 'Duplicate Container Template',
						onClick: () => {
							goto(`/templates/create?fromContainerTemplate=${containerTemplate.id}`)
						},
					},
					{
						value: 'delete',
						label: 'Delete Container Template',
						formAction: `?/delete`,
						formSubmit: async (e) => {
							const toast = addToast({
								data: {
									type: 'default',
									title: `Deleting container template "${containerTemplate.name}"...`,
								},
							})
		
							return async ({ result }) => {
								await applyAction(result)
		
								if(result.type === 'success')
									invalidate(`/api/container_template`)
		
								removeToast(toast.id)
							}
						},
					},
				]}
			/>
		</div>
	</header>

	<section class="column">
		<h3>Details</h3>

		<dl class="card column">
			<section class="row">
				<dt>Image</dt>

				<dd>
					{containerTemplate.image}
				</dd>
			</section>

			<section class="row">
				<dt>Service ID</dt>

				<dd>
					{containerTemplate.container_id}
				</dd>
			</section>

			{#if containerTemplate.description}
				<section class="row">
					<dt>Description</dt>

					<dd class="description">
						{containerTemplate.description}
					</dd>
				</section>
			{/if}

			<section class="row">
				<dt>Visibility</dt>

				<dd>
					{containerTemplate.external ? 'External' : 'Internal'}
				</dd>
			</section>

			<section class="row">
				<dt>Has GPU?</dt>

				<dd>
					{containerTemplate.gpu ? 'Yes' : 'No'}
				</dd>
			</section>

			{#if containerTemplate.allowed_ips?.length}
				<section class="row">
					<dt>Allowed IPs</dt>

					<dd>
						{#each containerTemplate.allowed_ips as ip}
							<p>{ip}</p>
						{/each}
					</dd>
				</section>
			{/if}

			{#if containerTemplate.allowed_addresses?.length}
				<section class="row">
					<dt>Allowed Addresses</dt>

					<dd>
						{#each containerTemplate.allowed_addresses as address}
							<p>{address}</p>
						{/each}
					</dd>
				</section>
			{/if}

			{#if containerTemplate.allowed_delegate_addresses?.length}
				<section class="row">
					<dt>Allowed Delegate Addresses</dt>

					<dd>
						{#each containerTemplate.allowed_delegate_addresses as address}
							<output>{address}</output>
						{/each}
					</dd>
				</section>
			{/if}

			{#if containerTemplate.command}
				<section class="row">
					<dt>Start Command</dt>

					<dd>
						<pre><code>{containerTemplate.command}</code></pre>
					</dd>
				</section>
			{/if}

			{#if containerTemplate.env && Object.entries(containerTemplate.env).length}
				<section class="row">
					<dt>Environment Variables</dt>

					<dd>
						<pre><code>{serializeEnvObject(containerTemplate.env)}</code></pre>
					</dd>
				</section>
			{/if}
		</dl>
	</section>

	<section class="column">
		<h3>Node Details</h3>

		<dl class="card column">
			<section class="row">
				<dt>Chain Enabled?</dt>

				<dd>
					{containerTemplate.chain_enabled ? 'Yes' : 'No'}
				</dd>
			</section>

			{#if containerTemplate.docker_account}
				<section class="row">
					<dt>Docker Hub Account</dt>

					<dd>
						{containerTemplate.docker_account.username}
					</dd>
				</section>
			{/if}
		</dl>
	</section>
</div>


<style>
	.container {
		gap: 2rem;
	}

	.icon {
		width: 1.5em;
		height: 1.5em;
	}

	header .icon {
		width: 4em;
		height: 4em;
		border-radius: 0.25em;
		padding: 0.5em;

		background-color: var(--color-ritualBlack);
		color: #fff;
	}

	output {
		font-size: 0.75em;

		& pre {
			overflow-y: auto;
			max-height: 15.6rem;
			padding: 1em;

			background: rgba(0, 0, 0, 0.05);
			border-radius: 0.5em;

			tab-size: 2;

			& code {
				white-space: pre-wrap;
				word-break: break-word;
			}
		}
	}

	.description {
		overflow: auto;
		max-height: 6lh;
	}
</style>
