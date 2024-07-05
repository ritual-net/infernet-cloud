<script lang="ts">
	// Types
	import type { Node, Edge } from '@xyflow/svelte'
	

	// Inputs
	export let nodes: Omit<Node, 'position'>[] = []
	export let edges: Edge[] = []

	export let direction: 'TB' | 'LR' | 'BT' | 'RL' = 'BT'
	export let nodeWidth = 180
	export let nodeHeight = 52

	export let layoutOptions: Omit<dagre.GraphLabel, 'rankdir'> = {
		ranker: 'longest-path',
		nodesep: 50,
		edgesep: 50,
		ranksep: 50,
	}


	// Functions
	import dagre from '@dagrejs/dagre'
	import { writable } from 'svelte/store'


	// Internal state
	let positionedNodes = writable<Node[]>([])

	$: $positionedNodes = (() => {
		const dagreGraph = new dagre.graphlib.Graph()

		dagreGraph.setGraph({
			...layoutOptions,
			rankdir: direction,
		})

		dagreGraph.setDefaultEdgeLabel(() => ({}))

		for(const node of nodes)
			dagreGraph.setNode(
				node.id,
				{
					width: node.width ?? nodeWidth,
					height: node.height ?? nodeHeight,
				}
			)

		for(const edge of edges)
			dagreGraph.setEdge(
				edge.source,
				edge.target
			)

		dagre.layout(dagreGraph)

		return nodes.map(node => {
			const { x, y } = dagreGraph.node(node.id)

			return {
				...node,
				targetPosition: { 'LR': Position.Left, 'TB': Position.Top, 'BT': Position.Bottom, 'RL': Position.Right }[direction],
				sourcePosition: { 'LR': Position.Right, 'TB': Position.Bottom, 'BT': Position.Top, 'RL': Position.Left }[direction],
				width: node.width ?? nodeWidth,
				height: node.height ?? nodeHeight,
				position: {
					x: x - nodeWidth / 2,
					y: y - nodeHeight / 2,
				},
			}
		})
	})()


	// Components
	import {
		SvelteFlow,
		Background,
		Position,
		ConnectionLineType,
	} from '@xyflow/svelte'


	// Styles
	import '@xyflow/svelte/dist/style.css'
</script>


<div class="container">
	<SvelteFlow
		fitView

		nodes={positionedNodes}
		nodesConnectable={false}

		edges={writable(edges)}
		connectionLineType={ConnectionLineType.SmoothStep}
		defaultEdgeOptions={{ type: 'smoothstep', animated: true }}
	>
		<Background />
	</SvelteFlow>
</div>


<style>
	.container {
		aspect-ratio: 2;
	}

	:global(.svelte-flow__node) {
		padding: 6px;
		white-space: pre-line;
	}

	:global(.svelte-flow__attribution) {
		display: none;
	}
</style>
