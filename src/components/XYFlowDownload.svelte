<script lang="ts">
	// Inputs
	export let fileName = 'xyflow'
	export let backgroundColor = '#1a365d'


	// Context
	import { useNodes } from '@xyflow/svelte'
	const nodes = useNodes()
	

	// Internal state
	const imageWidth = 1024
	const imageHeight = 768

	
	// Functions
	import { toPng } from 'html-to-image'
	import { getNodesBounds, getViewportForBounds } from '@xyflow/svelte'

	const onClick = async () => {
		const nodesBounds = getNodesBounds($nodes)

		const viewport = getViewportForBounds(
			nodesBounds,
			imageWidth,
			imageHeight,
			0.5,
			2.0,
			0.2
		)

		const viewportDomNode = document.querySelector<HTMLElement>('.svelte-flow__viewport')!

		if (viewport && viewportDomNode){
			const dataUrl = await toPng(
				viewportDomNode,
				{
					backgroundColor,
					width: imageWidth,
					height: imageHeight,
					style: {
						width: `${imageWidth}px`,
						height: `${imageHeight}px`,
						transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`
					},
				}
			)

			const link = document.createElement('a')
			link.download = `${fileName}.png`
			link.href = dataUrl
			link.click()
		}
	}


	// Components
	import { Panel } from '@xyflow/svelte'
</script>


<Panel position="top-right">
	<button
		class="small"
		on:click={onClick}
	>
		Download
	</button>
</Panel>
