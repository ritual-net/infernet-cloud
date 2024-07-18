<script lang="ts">
	// Types/constants
	import type { TFState } from '$/types/terraform'
	import { providers, ProviderTypeEnum } from '$/types/provider'


	// Inputs
	export let data: {
		provider: ProviderTypeEnum,
		resource: TFState['resources'][0],
	}


	// Functions
	import { formatResourceType, getAwsConsoleLink } from '$/lib/terraform/format'


	// Components
	import { Handle, Position } from '@xyflow/svelte'
</script>


<div
	class="node"
>
	<a
		href={data.resource.instances?.[0]?.attributes?.arn && getAwsConsoleLink(data.resource.instances[0].attributes.arn)}
		target="_blank"
		class="row"
	>
		<img
			src={providers[data.provider].icon}
			width="40"
			height="40"
		/>

		<div>
			<h5>{data.resource.name}</h5>
			<span class="annotation">{formatResourceType(data.resource.type)}</span>
		</div>
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
		padding: 0.66em 1em;

		background-color: rgb(255, 255, 255);
		border-radius: 0.5em;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 10%), 0 0 0 2px rgb(0 0 0 / 20%);

		> a {
			justify-content: start;
			cursor: pointer;
		}
	}
</style>
