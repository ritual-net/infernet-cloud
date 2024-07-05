<script lang="ts">
	// Types/constants
	import type { TerraformDeployment } from '$schema/interfaces'


	// Inputs
	export let deployment: TerraformDeployment


	// Functions
	const formatResourceType = (resourceType: string) => (
		resourceType
			.split('_')
			.map((word, i) => (
				word.length <= 3 && i <= 1
					? word.toUpperCase()
					: `${word[0].toUpperCase()}${word.slice(1)}`
			))
			.join(' ')
	)


	// Components
	import XYFlow from '$/components/XYFlow.svelte'
	import { MarkerType, ConnectionLineType } from '@xyflow/svelte'
</script>


{#if deployment.error}
	<section class="column">
		<dt>Error</dt>

		<dd class="scrollable">
			<output><code>{deployment.error}</code></output>
		</dd>
	</section>
{/if}

{#if deployment.tfstate?.resources?.length}
	<section class="column">
		<dt>Cloud Resources</dt>

		<dd>
			<XYFlow
				nodes={
					deployment.tfstate.resources
						.flatMap(resource => (
							resource.instances
								.map(instance => ({
									id: `${resource.type}.${resource.name}`,
									data: {
										label: [
											resource.name,
											formatResourceType(resource.type),
										].join('\n'),
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
				nodeWidth={300}
				nodeHeight={150}
				layoutOptions={{
					ranker: 'longest-path',
					nodesep: 0,
					edgesep: 0,
					ranksep: 0,
				}}
			/>
		</dd>
	</section>
{/if}

{#if deployment.tfstate}
	<section class="column">
		<dt>Terraform State</dt>

		<dd class="scrollable">
			<output><code>{JSON.stringify(deployment.tfstate, null, '\t')}</code></output>
		</dd>
	</section>
{/if}

{#if deployment.stdout?.length}
	<section class="column">
		<dt>Terraform Logs</dt>

		<dd class="scrollable log-container">
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
		</dd>
	</section>
{/if}

{#if deployment.stderr?.length}
	<section class="column">
		<dt>Terraform Error Logs</dt>

		<dd class="scrollable log-container">
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
		</dd>
	</section>
{/if}


<style>
	.scrollable {
		overflow: auto;
		padding: 0.66em 1em;

		resize: vertical;
		&:not([style*="height"]) {
			max-height: 19.6rem;
		}

		background: rgba(0, 0, 0, 0.05);
		border-radius: 0.5em;
	}

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
			right: 0;
			float: right;
			font-size: smaller;
			opacity: 0.5;
		}

		code {
			white-space: pre-line;
		}
	}
</style>
