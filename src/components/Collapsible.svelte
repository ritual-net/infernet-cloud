<script lang="ts">
	import { createCollapsible, melt } from '@melt-ui/svelte'
	import { slide } from 'svelte/transition'


	const {
		elements: { root, content, trigger },
		states: { open },
	} = createCollapsible()
</script>

	
<div use:melt={$root}>
	<button
		type="button"
		use:melt={$trigger}
	>
		<slot name="trigger" />
	</button>

	{#if $open}
		<div use:melt={$content} transition:slide>
			<slot />
		</div>
	{/if}
</div>


<style>
	button {
		padding: none;
		box-shadow: none;
	}
</style>
