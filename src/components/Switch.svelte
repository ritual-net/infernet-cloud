<script lang="ts">
	// Inputs
	export let labelText: string | undefined
	export let disabled = false


	// Internal state
	import { createSwitch, melt } from '@melt-ui/svelte'
	
	const {
		elements: { root, input },
	} = createSwitch({
		disabled,
	})

	const id = `switch-${crypto.randomUUID()}`
</script>


{#if labelText}
	<label
		for="{id}"
		id="{id}-label"
	>
		{labelText}
	</label>
{/if}

<button
	use:melt={$root}
	id="{id}"
	aria-labelledby="{id}-label"
>
	<span class="thumb" />
</button>

<input use:melt={$input} />


<style>
	:root {
		--switch-default-backgroundColor: #D9D9D940;
		--switch-checked-backgroundColor: var(--color-ritualBlack);
		--switch-backgroundColor: #D9D9D940;
		--switch-thumb-backgroundColor: #fff;
		--switch-width: 2.5em;
		--switch-height: 1.5em;
		--switch-padding: 2px;
	}

	button {
		--switch-backgroundColor: var(--switch-default-backgroundColor);

		display: grid;
		align-items: stretch;
		grid:
			'. thumb .' 100%
			/ 0fr auto 1fr
		;

		width: var(--switch-width);
		height: var(--switch-height);
		padding: var(--switch-padding);

		background-color: var(--switch-backgroundColor);
		border-radius: var(--switch-height);
		transition: 0.3s;

		&[data-state='checked'] {
			--switch-backgroundColor: var(--switch-checked-backgroundColor);

			grid-template-columns: 1fr auto 0fr;
		}
	}
	
	.thumb {
		grid-area: thumb;
		aspect-ratio: 1;

		background-color: var(--switch-thumb-backgroundColor);
		border-radius: 100%;
		box-shadow: 0 0 0 var(--card-borderWidth) var(--card-borderColor);
	}
</style>
