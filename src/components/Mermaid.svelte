<script lang="ts">
	// Context
  	import { browser } from '$app/environment'


	// Libraries
	import mermaid, { type RenderResult } from 'mermaid'


	// Props
	export let init: Record<string, any>
	export let id = 'mermaid'
	export let diagram: string


	// Internal state
	let result: RenderResult

	// (Derived)
	$: computedInit = {
		'theme': 'base',
		...init,
		'themeVariables': { 
			'fontFamily': 'inherit',
			'nodeBorder': '1px #0000001a solid',
			'mainBkg': '#fff',
			'nodeBorderRadius': '10px',
			'nodeShadow': '0 0 0 1px #0000001a,0 0 0 2px #0003',
			'nodeTextPadding': '0px',
			'nodePadding': '0px',
			...init?.themeVariables,
		},
	}


	// Actions
	$: if(browser) (async () => {
		mermaid.initialize({ startOnLoad: true })

		result = await mermaid.render(
			id,
			`%%{init: ${JSON.stringify(computedInit)}}%%\n${diagram}`,
		)
	})()
</script>


{#if result?.svg}
	{@html result.svg}
{/if}
