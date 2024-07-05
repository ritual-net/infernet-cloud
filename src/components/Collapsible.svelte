<script lang="ts">
	// Inputs
	export let open: boolean


	// Internal state
	import { createCollapsible, createSync, melt } from '@melt-ui/svelte'

	const {
		elements: { root, content, trigger },
		states,
	} = createCollapsible()

	$: createSync(states).open(
		open,
		_ => { open = _ },
	)


	// Transitions/animations
	import { slide } from 'svelte/transition'
</script>

	
<div
	use:melt={$root}
	class="column {$$restProps.class}"
>
	{#if $$slots.trigger}
		<button
			type="button"
			use:melt={$trigger}
		>
			<slot name="trigger" />
		</button>
	{/if}

	{#if open}
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

		&:empty, &:not(:has(*)) {
			display: contents;
		}
	}

	[data-melt-collapsible-trigger] {
		padding: 0;
		box-shadow: none;
	}
</style>
