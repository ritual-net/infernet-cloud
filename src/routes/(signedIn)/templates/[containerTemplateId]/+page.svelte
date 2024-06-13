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
							<p><output>{address}</output></p>
						{/each}
					</dd>
				</section>
			{/if}

			{#if containerTemplate.allowed_delegate_addresses?.length}
				<section class="row">
					<dt>Allowed Delegate Addresses</dt>

					<dd>
						{#each containerTemplate.allowed_delegate_addresses as address}
							<p><output>{address}</output></p>
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

			<section class="row">
				<dt>Rate Limiting</dt>

				<dd>
					{containerTemplate.rate_limit_num_requests} {{ 'one': 'request', 'other': 'requests' }[new Intl.PluralRules('en-US').select(containerTemplate.rate_limit_num_requests)]}
					every {containerTemplate.rate_limit_period} {{ 'one': 'second', 'other': 'seconds' }[new Intl.PluralRules('en-US').select(containerTemplate.rate_limit_period)]}
				</dd>
			</section>

			{#if containerTemplate.accepted_payments?.length}
				<section class="row">
					<dt>Payments</dt>

					<dd>
						<ul>
							{#each containerTemplate.accepted_payments as payment, i}
								{@const token = (
									containerTemplate.chain_id && containerTemplate.chain_id in tokensByChainId
										? tokensByChainId[containerTemplate.chain_id]
											.find((token) => token.address === payment.address)
										: null
								)}

								<li>
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
											<span><output>{payment.address}</output></span>
										{/if}
									</span>
								</li>
							{/each}
						</ul>
					</dd>
				</section>
			{/if}

			{#if containerTemplate.generates_proofs !== undefined}
				<section class="row">
					<dt>Generates Proofs?</dt>

					<dd>
						{containerTemplate.generates_proofs ? 'Yes' : 'No'}
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
