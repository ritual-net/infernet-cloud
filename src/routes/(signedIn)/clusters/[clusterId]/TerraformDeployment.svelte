<script lang="ts">
	// Types/constants
	import type { TerraformDeployment } from '$schema/interfaces'
	import { providers, ProviderTypeEnum } from '$/types/provider'


	// Inputs
	export let clusterName: string
	export let provider: ProviderTypeEnum
	export let deployment: TerraformDeployment
	export let isSummary = false


	// Functions
	import { formatResourceType, getAwsConsoleLink, getGcpConsoleLink } from '$/lib/terraform/format'


	// Components
	import DetailsValue from '$/components/DetailsValue.svelte'
	import ScrollArea from '$/components/ScrollArea.svelte'
	import XYFlow from '$/components/XYFlow.svelte'
	import XYFlowDownload from '$/components/XYFlowDownload.svelte'
	import { MarkerType, ConnectionLineType } from '@xyflow/svelte'
	import TerraformResourceNode from './TerraformResourceNode.svelte'
</script>


{#if !isSummary && deployment.command}
	<section class="column">
		<dt>Command</dt>

		<dd class="log-container scrollable">
			<output><code>{deployment.command}</code></output>
		</dd>
	</section>
{/if}

{#if deployment.error}
	<section class="column">
		<dt>Error</dt>

		<dd class="log-container scrollable">
			<output><code>{deployment.error}</code></output>
		</dd>
	</section>
{/if}

{#if deployment.tfstate?.resources?.length}
	<section class="column">
		<dt>Cloud resources</dt>

		<dd class="column">
			{#if deployment.tfstate?.resources?.flatMap(resource => resource.instances).length}
				<XYFlow
					nodeTypes={{
						'resource': TerraformResourceNode,
					}}
					nodes={
						deployment.tfstate.resources
							.flatMap(resource => (
								resource.instances
									.map(instance => ({
										id: `${resource.type}.${resource.name}`,
										type: 'resource',
										data: {
											provider,
											resource,
										},
									}))
							))
					}
					edges={
						deployment.tfstate.resources
							.flatMap(resource => (
								resource.instances
									.flatMap(instance => (
										instance.dependencies
											?.map(dependencyId => {
												const [type, name] = dependencyId.split('.')
												return { type, name }
											})
											.map(dependency => ({
												id: `${resource.type}.${resource.name}-${dependency.type}.${dependency.name}`,
												source: `${resource.type}.${resource.name}`,
												target: `${dependency.type}.${dependency.name}`,
												type: ConnectionLineType.Bezier,
												markerEnd: {
													type: MarkerType.ArrowClosed,
												},
											}))
										?? []
									))
							))
					}
					direction="BT"
					nodeWidth={345}
					nodeHeight={75}
					layoutOptions={{
						// ranker: 'tight-tree',
						ranker: 'longest-path',
						nodesep: 50,
						edgesep: 50,
						ranksep: 60,
					}}
				>
					<XYFlowDownload
						fileName={`${clusterName}-resources-${deployment.action}-${deployment.timestamp}`}
					/>
				</XYFlow>
			{/if}

			<ScrollArea
				tagName="dl"
			>
				<div class="resources card column">
					{#each deployment.tfstate.resources as resource}
						<section
							id="terraform-resource-{deployment.id}-{resource.type}-{resource.name}"
							class="column"
						>
							<dt>
								{formatResourceType(resource.type)}: {resource.name}
							</dt>

						<dd>
							{#each resource.instances as instance}
								<dl
									class="card column"
								>
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
												<dt>Tag</dt>
												<dd>
													<p>{instance.attributes.tags.Name}</p>
												</dd>
											</section>
										{/if}

										{#if instance.attributes?.id}
											<section class="row wrap">
												<dt>ID</dt>
												<dd>
													<output><code>{instance.attributes.id}</code></output>
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
															<a href="#terraform-resource-{deployment.id}-{type}-{name}">
																{name} ({type})
															</a>
														</p>
													{/each}
												</dd>
											</section>
										{/if}
									</dl>
								{:else}
									<div class="card column">
										<p>No resources found.</p>
									</div>
								{/each}
							</dd>
						</section>
					{/each}
				<!-- </div> -->
			</ScrollArea>
		</dd>
	</section>
{/if}

{#if !isSummary && deployment.tfstate}
	<section class="column">
		<dt>Terraform state</dt>

		<ScrollArea
			tagName="dd"
		>
			<div class="log-container">
				<output><code>{JSON.stringify(deployment.tfstate, null, '\t')}</code></output>
			</div>
		</ScrollArea>
	</section>
{/if}

{#if deployment.stdout?.length}
	<section class="column">
		<dt>Terraform logs</dt>

		<ScrollArea
			tagName="dd"
		>
			<div class="log-container">
				{#each deployment.stdout as log, i}
					{@const previousLog = deployment.stdout[i - 1]}

					{#if previousLog && previousLog['@type'] !== log['@type']}
						<hr>
					{/if}

					<div
						class="log"
						data-type={log['type']} 
						data-level={log['@level']}
						data-module={log['@module']}
					>
						<output><date date={log['@timestamp']}>{new Date(log['@timestamp']).toLocaleString()}</date> <code>{log['@message']}</code></output>

						{#if log['type'] === 'diagnostic' && 'diagnostic' in log}
							<div class="diagnostic-log">
								{#if log.diagnostic.detail}
									<output><code>{log.diagnostic.detail}</code></output>
								{/if}

								{#if log.diagnostic.snippet?.code}
									<blockquote>
										<output><pre><code>{log.diagnostic.snippet?.code}</code></pre></output>
									</blockquote>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</ScrollArea>
	</section>
{/if}

{#if deployment.stderr?.length}
	<section class="column">
		<dt>Terraform error logs</dt>

		<ScrollArea
			tagName="dd"
		>
			<div class="log-container">
				{#each deployment.stderr as log, i}
					{@const previousLog = deployment.stderr[i - 1]}

					{#if previousLog && previousLog['@type'] !== log['@type']}
						<hr>
					{/if}

					<output
						class="log"
						data-type={log['type']} 
						data-level={log['@level']}
						data-module={log['@module']}
					><date date={log['@timestamp']}>{new Date(log['@timestamp']).toLocaleString()}</date> <code>{log['@message']}</code></output>
				{/each}
			</div>
		</ScrollArea>
	</section>
{/if}


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
