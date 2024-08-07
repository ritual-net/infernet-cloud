<script lang="ts">
	// Types/constants
	import { chainsByChainId } from '$/lib/chains'
	import { tokensByChainId } from '$/lib/tokens'


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

				<p>Container template</p>
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
			<section class="row wrap">
				<dt>Image</dt>

				<dd>
					{containerTemplate.image}
				</dd>
			</section>

			<section class="row wrap">
				<dt>Service ID</dt>

				<dd>
					{containerTemplate.container_id}
				</dd>
			</section>

			{#if containerTemplate.description}
				<section class="row wrap">
					<dt>Description</dt>

					<dd class="description">
						{containerTemplate.description}
					</dd>
				</section>
			{/if}

			<section class="row wrap">
				<dt>Visibility</dt>

				<dd>
					{containerTemplate.external ? 'External' : 'Internal'}
				</dd>
			</section>

			<section class="row wrap">
				<dt>Has GPU?</dt>

				<dd>
					{containerTemplate.gpu ? 'Yes' : 'No'}
				</dd>
			</section>

			{#if containerTemplate.allowed_ips?.length}
				<section class="row wrap">
					<dt>Allowed IPs</dt>

					<dd>
						{#each containerTemplate.allowed_ips as ip}
							<p>{ip}</p>
						{/each}
					</dd>
				</section>
			{/if}

			{#if containerTemplate.allowed_addresses?.length}
				<section class="row wrap">
					<dt>Allowed addresses</dt>

					<dd>
						{#each containerTemplate.allowed_addresses as address}
							<p><code>{address}</code></p>
						{/each}
					</dd>
				</section>
			{/if}

			{#if containerTemplate.allowed_delegate_addresses?.length}
				<section class="row wrap">
					<dt>Allowed delegate addresses</dt>

					<dd>
						{#each containerTemplate.allowed_delegate_addresses as address}
							<p><code>{address}</code></p>
						{/each}
					</dd>
				</section>
			{/if}

			{#if containerTemplate.command}
				<section class="row wrap">
					<dt>Start command</dt>

					<dd>
						<pre><code>{containerTemplate.command}</code></pre>
					</dd>
				</section>
			{/if}

			{#if containerTemplate.env && Object.entries(containerTemplate.env).length}
				<section class="column">
					<dt>Environment variables</dt>

					<dd>
						<!-- <pre><code>{serializeEnvObject(containerTemplate.env)}</code></pre> -->

						<dl class="card column">
							{#each Object.entries(containerTemplate.env) as [key, value] (key)}
								<section class="row wrap">
									<dt>{key}</dt>

									<dd>
										<output>{value}</output>
									</dd>
								</section>
							{/each}
						</dl>
					</dd>
				</section>
			{/if}

			<section class="row wrap">
				<dt>Rate limiting</dt>

				<dd>
					{containerTemplate.rate_limit_num_requests} {{ 'one': 'request', 'other': 'requests' }[new Intl.PluralRules('en-US').select(containerTemplate.rate_limit_num_requests)]}
					every {containerTemplate.rate_limit_period} {{ 'one': 'second', 'other': 'seconds' }[new Intl.PluralRules('en-US').select(containerTemplate.rate_limit_period)]}
				</dd>
			</section>

			{#if containerTemplate.accepted_payments?.length}
				<section class="row">
					<dt>Payments</dt>

					<dd class="column inline">
						{#each containerTemplate.accepted_payments as payment, i}
							{@const token = (
								containerTemplate.chain_id && containerTemplate.chain_id in tokensByChainId
									? tokensByChainId[containerTemplate.chain_id]
										.find((token) => token.address === payment.address)
									: null
							)}

							<p>
								<span class="row inline with-icon">
									<span>≥</span>
									{#if token}
										{@const formattedAmount = String(Number(payment.amount) / 10 ** token.decimals)}
										{@const [number, exponent] = formattedAmount.split('e')}

										<abbr
											title={payment.amount}
										>
											{number}
											{#if exponent}
												× 10<sup>{exponent}</sup>
											{/if}
										</abbr>

										<abbr
											title={token.address}
											class="row inline with-icon"
										>
											<img
												src={token.icon}
												alt={token.name}
												class="icon"
											/>
											{token.name}
										</abbr>
									{:else}
										<span>{payment.amount}</span>
										<span>units</span>
										<span><code>{payment.address}</code></span>
									{/if}
								</span>
							</p>
						{/each}
					</dd>
				</section>
			{/if}

			{#if containerTemplate.generates_proofs !== undefined}
				<section class="row">
					<dt>Generates proofs?</dt>

					<dd>
						{containerTemplate.generates_proofs ? 'Yes' : 'No'}
					</dd>
				</section>
			{/if}
		</dl>
	</section>

	<section class="column">
		<h3>Node details</h3>

		<dl class="card column">
			<section class="row wrap">
				<dt>Onchain?</dt>

				<dd>
					{containerTemplate.chain_enabled ? 'Yes' : 'No'}
				</dd>
			</section>

			<section class="row">
				<dt>Chain</dt>

				<dd>
					{#if containerTemplate.chain_id && chainsByChainId.has(containerTemplate.chain_id)}
						{@const chain = chainsByChainId.get(containerTemplate.chain_id)}

						<span class="row inline with-icon">
							<img
								src={chain.icon}
								alt={chain.name}
								class="icon"
							/>
							{chain.name}
						</span>
					{:else}
						{containerTemplate.chain_id}
					{/if}
				</dd>
			</section>

			{#if containerTemplate.docker_account}
				<section class="row wrap">
					<dt>Docker Hub account</dt>

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
		flex-shrink: 0;
		width: 4em;
		height: 4em;
		border-radius: 0.25em;
		padding: 0.5em;

		background-color: var(--color-ritualBlack);
		color: #fff;
	}

	.description {
		overflow: auto;
		max-height: 6lh;
	}
</style>
