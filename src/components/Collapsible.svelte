<script lang="ts">
	import { createCollapsible, melt } from '@melt-ui/svelte'
	import { slide } from 'svelte/transition'


	const {
		elements: { root, content, trigger },
		states: { open },
	} = createCollapsible()
</script>

	
<div
	use:melt={$root}
	class="column"
>
	<button
		type="button"
		use:melt={$trigger}
	>
		<slot name="trigger" />
	</button>

	{#if $open}
		<div
			use:melt={$content}
			transition:slide
			class="column"
		>
			<slot />
		</div>
	{/if}
</div>


<style>
	[data-melt-collapsible] {
		gap: 0;
	}

	[data-melt-collapsible-trigger] {
		padding: 0;
		box-shadow: none;
	}
</style>
