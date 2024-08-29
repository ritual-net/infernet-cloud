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
		...init,
		'themeVariables': {
			'fontFamily': 'inherit',
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
