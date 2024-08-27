<script lang="ts">
	// Types/constants
	import type { TFState } from '$/types/terraform'
	import { providers, ProviderTypeEnum } from '$/types/provider'


	// Inputs
	export let deploymentId: string
	export let provider: ProviderTypeEnum
	export let resource: TFState['resources'][number]
	export let instance: TFState['resources'][number]['instances'][number]


	// Functions
	import { formatResourceType, getAwsConsoleLink, getGcpConsoleLink } from '$/lib/terraform/format'


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import DetailsValue from '$/components/DetailsValue.svelte'
</script>


<Collapsible>
	<svelte:fragment slot="trigger"
		let:open
	>
		<header
			class="row wrap"
		>
			<div class="row inline with-icon">
				<img
					src={providers[provider].icon}
					width="30"
					height="30"
				/>

				<div class="column inline">
					<h4>{formatResourceType(resource.type)}</h4>
					<p>{instance.attributes.name}</p>
				</div>
			</div>

			<div class="row">
				<a
					href={provider === ProviderTypeEnum.GCP ? getGcpConsoleLink(instance.attributes.self_link) : getAwsConsoleLink(instance.attributes.arn)}
					target="_blank"
					class="button"
				>
					Console
				</a>

				<span data-after={open ? '▴' : '▾'}></span>
			</div>
		</header>
	</svelte:fragment>

	<section
		id="terraform-resource-{deploymentId}-{resource.type}-{instance.attributes.id}"
		class="column"
	>
		<dl class="card column">
			{#if instance.attributes?.tags?.Name}
				<section class="row wrap">
					<dt>Tag</dt>
					<dd>{instance.attributes.tags.Name}</dd>
				</section>
			{/if}

			{#if instance.attributes?.id}
				<section class="row wrap">
					<dt>ID</dt>
					<dd>
						{#if instance.attributes.self_link}
							<a
								href={getGcpConsoleLink(instance.attributes.self_link)}
								target="_blank"
								class="row inline with-icon"
							>
								<img
									src={providers[ProviderTypeEnum.GCP].icon}
									width="20"
									height="20"
								/>

								<output><code>{instance.attributes.id}</code></output>
							</a>
						{:else}
							<output><code>{instance.attributes.id}</code></output>
						{/if}
					</dd>
				</section>
			{/if}

			{#if instance.attributes?.arn}
				<section class="row wrap">
					<dt>ARN</dt>
					<dd>
						<p>
							<a
								href={getAwsConsoleLink(instance.attributes.arn)}
								target="_blank"
								class="row inline with-icon"
							>
								<img
									src={providers[ProviderTypeEnum.AWS].icon}
									width="20"
									height="20"
								/>

								{instance.attributes.arn}
							</a>
						</p>
					</dd>
				</section>
			{/if}

			{#each Object.entries(instance.attributes) as [key, value]}
				{#if (
					!['tags', 'tags_all', 'id', 'arn'].includes(key)
					&& value !== null && !(Array.isArray(value) && value.length === 0)
				)}
					<section class="row wrap">
						<dt>{key}</dt>
						<dd>
							<DetailsValue
								{value}
							/>
						</dd>
					</section>
				{/if}
			{/each}

			{#if instance.dependencies?.length}
				<section class="row wrap">
					<dt>Dependencies</dt>
					<dd>
						{#each instance.dependencies as dependency}
							{@const [type, name] = dependency.split('.')}

							<p>
								<a href="#terraform-resource-{deploymentId}-{type}-{name}">
									{name} ({type})
								</a>
							</p>
						{/each}
					</dd>
				</section>
			{/if}
		</dl>
	</section>
</Collapsible>


<style>
	blockquote {
		padding: 0.5em 0.75em;
		font-size: smaller;
		margin-block: 0.5em;

		background: rgba(0, 0, 0, 0.05);
		border-radius: 0.5em;
	}

	output {
		font-size: 0.75em;
	}

	code {
		white-space: pre-wrap;
		word-break: break-word;
		tab-size: 2;
	}

	.log-container {
		display: grid;
		align-items: center;

		padding: 0.66em 1em;
		background: rgba(0, 0, 0, 0.05);
		border-radius: 0.5em;

		.log {
			margin-inline: -1rem;
			padding-inline: 1rem;
			padding-block: 0.1rem;

			&[data-level="error"] {
				background-color: rgb(255, 246, 246);
				color: rgb(150, 0, 0);
			}
		}

		date {
			position: sticky;
			top: 0.25em;
			right: 0;
			float: right;
			margin-left: 1em;
			line-height: 2.4;
			font-size: smaller;
			opacity: 0.5;
		}

		/* code {
			white-space: pre-line;
		} */
	}

	.resources {
		font-size: 0.9em;
		background-color: #0000000d;
	}
</style>
