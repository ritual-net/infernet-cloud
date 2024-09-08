<script lang="ts">
	// Types/constants
	import type { TFState } from '$/types/terraform'
	import { providers, ProviderTypeEnum } from '$/types/provider'


	// Inputs
	export let data: {
		provider: ProviderTypeEnum,
		resourceType: TFState['resources'][number],
		resource: TFState['resources'][0]['instances'][number],
	}


	// Functions
	import { formatResourceType, getAwsConsoleLink, getGcpConsoleLink } from '$/lib/terraform/format'


	// Internal state
	$: link = (
		data.provider === ProviderTypeEnum.AWS && data.resource.attributes?.arn ?
			getAwsConsoleLink(data.resource.attributes.arn)
		: data.provider === ProviderTypeEnum.GCP && data.resource?.attributes?.self_link ?
			getGcpConsoleLink(data.resource.attributes.self_link)
		:
			''
	)


	// Components
	import { Handle, Position } from '@xyflow/svelte'
</script>


<div
	class="node"
>
	<a
		href={link}
		target="_blank"
		class="row"
	>
		<div class="row">
			<img
				src={providers[data.provider].icon}
				width="40"
				height="40"
			/>

			<div>
				<h5>{data.resourceType.name}</h5>
				<span class="annotation">{formatResourceType(data.resourceType.type)}</span>
				{#if data.resource.id}
					<span class="annotation">{data.resource.id}</span>
				{/if}
			</div>
		</div>

		<span>↗</span>
	</a>

	<Handle
		type="target"
		position={Position.Bottom}
	/>
	<Handle
		type="source"
		position={Position.Top}
	/>
</div>


<style>
	.node {
		--xy-handle-background-color: transparent; 
		--xy-handle-border-color: transparent;

		display: grid;
		padding: 0.5em 1em;

		background-color: rgb(255, 255, 255);
		border-radius: 0.5em;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 10%), 0 0 0 2px rgb(0 0 0 / 20%);

		> a {
			cursor: pointer;
		}
	}
</style>
