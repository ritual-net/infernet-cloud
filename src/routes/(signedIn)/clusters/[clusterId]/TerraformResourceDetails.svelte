<script lang="ts">
	// Types/constants
	import type { TFState } from '$/types/terraform'
	import { providers, ProviderTypeEnum } from '$/types/provider'


	// Inputs
	export let deploymentId: string
	export let provider: ProviderTypeEnum
	export let resourceType: TFState['resources'][number]
	export let resource: TFState['resources'][number]['instances'][number]


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
			<div class="row">
				<img
					src={providers[provider].icon}
					width="30"
					height="30"
				/>

				<div>
					<h4>
						{formatResourceType(resourceType.type)}
						<span class="annotation">{resourceType.name}</span>
					</h4>

					{#if resource.attributes.name || resource.attributes.id}
						<p class="annotation">{resource.attributes.name || resource.attributes.id}</p>
					{/if}
				</div>
			</div>

			<div class="row">
				<a
					href={
						provider === ProviderTypeEnum.GCP
							? getGcpConsoleLink(resource.attributes.self_link)
							: getAwsConsoleLink(resource.attributes.arn)
					}
					target="_blank"
					class="button small"
				>
					Console
				</a>

				<span data-after={open ? '▴' : '▾'}></span>
			</div>
		</header>
	</svelte:fragment>

	<section
		class="column"
	>
		<dl class="card column">
			{#if resource.attributes?.tags?.Name}
				<section class="row wrap">
					<dt>Tag</dt>
					<dd>{resource.attributes.tags.Name}</dd>
				</section>
			{/if}

			{#if resource.attributes?.id}
				<section class="row wrap">
					<dt>ID</dt>
					<dd>
						{#if resource.attributes.self_link}
							<a
								href={getGcpConsoleLink(resource.attributes.self_link)}
								target="_blank"
								class="row inline with-icon"
							>
								<img
									src={providers[ProviderTypeEnum.GCP].icon}
									width="20"
									height="20"
								/>

								<output><code>{resource.attributes.id}</code></output>
							</a>
						{:else}
							<output><code>{resource.attributes.id}</code></output>
						{/if}
					</dd>
				</section>
			{/if}

			{#if resource.attributes?.arn}
				<section class="row wrap">
					<dt>ARN</dt>
					<dd>
						<p>
							<a
								href={getAwsConsoleLink(resource.attributes.arn)}
								target="_blank"
								class="row inline with-icon"
							>
								<img
									src={providers[ProviderTypeEnum.AWS].icon}
									width="20"
									height="20"
								/>

								{resource.attributes.arn}
							</a>
						</p>
					</dd>
				</section>
			{/if}

			{#each Object.entries(resource.attributes) as [key, value]}
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

			{#if resource.dependencies?.length}
				<section class="row wrap">
					<dt>Dependencies</dt>
					<dd>
						{#each resource.dependencies as dependency}
							{@const [type, name] = dependency.split('.')}

							<p>
								<a href="#/terraform-resourceType/{deploymentId}/{type}/{name}">
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
	output {
		font-size: 0.75em;
	}

	code {
		white-space: pre-wrap;
		word-break: break-word;
		tab-size: 2;
	}
</style>
