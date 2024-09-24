<script lang="ts">
	// Types/constants
	import type { Container } from '$schema/interfaces'
	import { tokensByChainId } from '$/lib/tokens'


	// Context
	export let chainId: number | undefined
	export let container: Container


	// Functions
	import { serializeEnvObject } from '$/lib/utils/env'


	// Components
	import RitualLogo from '$/icons/RitualLogo.svelte'
	import WithIcon from '$/components/WithIcon.svelte'
	import { DockerIcon } from '$/icons'
</script>


<dl class="card column">
	<section class="row wrap">
		<dt>Image</dt>

		<dd>
			<WithIcon
				icon={DockerIcon}
			>
				{container.image}
			</WithIcon>
		</dd>
	</section>

	<section class="row wrap">
		<dt>Service ID</dt>

		<dd>
			<WithIcon
				icon={RitualLogo}
			>
				{container.container_id}
			</WithIcon>
		</dd>
	</section>

	{#if container.description}
		<section class="row wrap">
			<dt>Description</dt>

			<dd class="description">
				{container.description}
			</dd>
		</section>
	{/if}

	<section class="row wrap">
		<dt>Visibility</dt>

		<dd>
			{container.external ? 'External' : 'Internal'}
		</dd>
	</section>

	<section class="row wrap">
		<dt>Has GPU?</dt>

		<dd>
			{container.gpu ? 'Yes' : 'No'}
		</dd>
	</section>

	{#if container.allowed_ips?.length}
		<section class="row wrap">
			<dt>Allowed IPs</dt>

			<dd>
				{#each container.allowed_ips as ip}
					<p>{ip}</p>
				{/each}
			</dd>
		</section>
	{/if}

	{#if container.allowed_addresses?.length}
		<section class="row wrap">
			<dt>Allowed addresses</dt>

			<dd>
				{#each container.allowed_addresses as address}
					<p><code>{address}</code></p>
				{/each}
			</dd>
		</section>
	{/if}

	{#if container.allowed_delegate_addresses?.length}
		<section class="row wrap">
			<dt>Allowed delegate addresses</dt>

			<dd>
				{#each container.allowed_delegate_addresses as address}
					<p><code>{address}</code></p>
				{/each}
			</dd>
		</section>
	{/if}

	{#if container.command}
		<section class="row wrap">
			<dt>Start command</dt>

			<dd>
				<pre><code>{container.command}</code></pre>
			</dd>
		</section>
	{/if}

	{#if container.env && Object.entries(container.env).length}
		<section class="column">
			<dt>Environment variables</dt>

			<dd>
				<!-- <pre><code>{serializeEnvObject(containerTemplate.env)}</code></pre> -->

				<dl class="card column">
					{#each Object.entries(container.env) as [key, value] (key)}
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
			{container.rate_limit_num_requests ?? 60} {{ 'one': 'request', 'other': 'requests' }[new Intl.PluralRules('en-US').select(container.rate_limit_num_requests ?? 60)]}
			every {(container.rate_limit_period ?? 60.0).toFixed(1)} {{ 'one': 'second', 'other': 'seconds' }[new Intl.PluralRules('en-US').select(container.rate_limit_period ?? 60.0)]}
		</dd>
	</section>

	{#if container.accepted_payments?.length}
		<section class="row">
			<dt>Payments</dt>

			<dd class="column inline">
				{#each container.accepted_payments as payment, i}
					{@const token = (
						chainId && chainId in tokensByChainId
							? tokensByChainId[chainId]
								.find(token => token.address === payment.address)
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

	{#if container.generates_proofs !== undefined}
		<section class="row">
			<dt>Generates proofs?</dt>

			<dd>
				{container.generates_proofs ? 'Yes' : 'No'}
			</dd>
		</section>
	{/if}
</dl>


<style>
	.icon {
		width: 1.5em;
		height: 1.5em;
	}

	.description {
		overflow: auto;
		max-height: 6lh;
	}
</style>
