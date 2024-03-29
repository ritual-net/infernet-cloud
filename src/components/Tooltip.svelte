<script lang="ts">
	// Inputs
	export let labelText: string | undefined


	// Internal state
	import { melt, createTooltip } from '@melt-ui/svelte'

	const {
		elements: { trigger, content, arrow },
		states: { open },
	} = createTooltip({
		positioning: {
			placement: 'top',
		},
		openDelay: 0,
		closeDelay: 0,
		closeOnPointerDown: false,
		forceVisible: true,
		disableHoverableContent: true,
	})


	// Transitions
	import { fade } from 'svelte/transition'
</script>


<button
	type="button"
	tabindex="-1"
	use:melt={$trigger}
	aria-label={labelText}
>
	<slot />
</button>

{#if $open}
	<div
		use:melt={$content}
		transition:fade={{ duration: 100 }}
	>
		<div use:melt={$arrow} />

		<slot name="content" />
	</div>
{/if}

	
<style>
	:root {
		--tooltip-backgroundColor: #fff;
		--tooltip-borderColor: var(--borderColor);
		--tooltip-borderWidth: var(--borderWidth);
		--tooltip-cornerRadius: 0.33em;
	}
	
	[data-melt-tooltip-trigger] {
		all: unset;
		display: flex;
	}
	
	[data-melt-tooltip-content] {
		z-index: 2;
		padding: 0.25em 0.66em;
		
		box-shadow: 0 0 0 var(--tooltip-borderWidth) var(--tooltip-borderColor);
		background-color: var(--tooltip-backgroundColor);
		backdrop-filter: var(--backdropFilter);
		border-radius: var(--tooltip-cornerRadius);

		& [data-melt-tooltip-arrow] {
			filter: drop-shadow(calc(-1 * var(--tooltip-borderWidth)) calc(-1 * var(--tooltip-borderWidth)) var(--tooltip-borderColor));
		}
	}
</style>
