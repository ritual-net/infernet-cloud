<script lang="ts">
	// Types/constants
	import type { TerraformDeployment } from '$schema/interfaces'
	import { ProviderTypeEnum } from '$/types/provider'


	// Inputs
	export let clusterName: string
	export let provider: ProviderTypeEnum
	export let deployment: TerraformDeployment
	export let isSummary = false


	// Components
	import ScrollArea from '$/components/ScrollArea.svelte'
	import TerraformResourceDetails from './TerraformResourceDetails.svelte'
	import Mermaid from '$/components/Mermaid.svelte'
	import XYFlow from '$/components/XYFlow.svelte'
	import XYFlowDownload from '$/components/XYFlowDownload.svelte'
	import { MarkerType, ConnectionLineType } from '@xyflow/svelte'
	import TerraformResourceNode from './TerraformResourceNode.svelte'
	import TerraformResourceTypeNode from './TerraformResourceTypeNode.svelte'
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
			{#if deployment.tfstate?.resources?.flatMap(resourceType => resourceType.instances).length}
				<!-- <XYFlow
					nodeTypes={{
						'group': TerraformResourceTypeNode,
						'resource': TerraformResourceNode,
					}}
					nodes={
						deployment.tfstate.resources
							.flatMap(resourceType => {
								const parentNode = {
									id: `resourceType.${resourceType.type}`,
									type: 'group',
									data: {
										provider,
										resourceType,
									},
									width: 700,
									height: 150,
								}

								const childNodes = (
									resourceType.instances
										.map(resource => ({
											id: `resource.${resource.attributes.id}`,
											type: 'resource',
											data: {
												provider,
												resourceType,
												resource,
											},
											parentId: `resourceType.${resourceType.type}`,
											extent: 'parent',
										}))
								)

								return [parentNode, ...childNodes]
							})
					}
					edges={
						deployment.tfstate.resources
							.flatMap(resourceType => (
								resourceType.instances
									.flatMap(resource => (
										resource.dependencies
											?.map(dependencyId => {
												const [dependencyResourceType, dependencyName] = dependencyId.split('.')

												return {
													id: `resource.${resource.attributes.id}-${dependencyResourceType}.${dependencyName}`,
													source: `resource.${resource.attributes.id}`,
													target: `resourceType.${dependencyResourceType}`,
													type: ConnectionLineType.Bezier,
													markerEnd: {
														type: MarkerType.ArrowClosed,
													},
												};
											})
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
				</XYFlow> -->

				<Mermaid
					init={{
						'flowchart': {
							'defaultRenderer': 'forceGraph',
						},
					}}
					diagram={`
						flowchart BT
							${deployment.tfstate.resources.map(resourceType => `
								subgraph resourceType.${resourceType.type} [
									${resourceType.type}
								]
									${resourceType.instances.map(resource => `
										resource.${resource.attributes.id}(
											${resource.attributes.id}
										)
									`).join('\n')}
								end
							`).join('\n')}

							${deployment.tfstate?.resources.flatMap(resourceType =>
								resourceType.instances?.flatMap(resource => (
									resource.dependencies?.map(dependencyId => {
										const [dependencyResourceType, dependencyName] = dependencyId.split('.')

										return `
											resource.${resource.attributes.id} --> resourceType.${dependencyResourceType}
										`
									})
								))
							).join('\n')}
					`}
				/>
			{/if}

			<!-- <ScrollArea
				tagName="dl"
				containerProps={{
					class: 'card',
				}}
			> -->
				<div class="resources card column">
					{#each deployment.tfstate.resources as resourceType}
						{#each resourceType.instances as resource}
							<TerraformResourceDetails
								deploymentId={deployment.id}
								{provider}
								{resourceType}
								{resource}
							/>
						<!-- {:else}
							<div class="card column">
								<p>No resources found.</p>
							</div> -->
						{/each}
					{/each}
				</div>
			<!-- </ScrollArea> -->
		</dd>
	</section>
{/if}

{#if !isSummary && deployment.tfvars}
	<section class="column">
		<dt>Terraform input variables</dt>

		<dd class="log-container scrollable">
			<output><code>{deployment.tfvars}</code></output>
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
		background: light-dark(rgba(0, 0, 0, 0.05), rgba(255, 255, 255, 0.05));
		border-radius: 0.5em;

		.log {
			margin-inline: -1rem;
			padding-inline: 1rem;
			padding-block: 0.1rem;

			&[data-level="error"] {
				background-color: light-dark(rgb(255, 246, 246), rgb(50, 0, 0));
				color: light-dark(rgb(150, 0, 0), rgb(255, 100, 100));
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
		background-color: light-dark(#0000000d, #ffffff0d);
	}
</style>
