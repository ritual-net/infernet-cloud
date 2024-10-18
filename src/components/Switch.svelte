<script lang="ts">
	// Types
	import type { ChangeFn } from '@melt-ui/svelte/internal/helpers'


	// Inputs
	export let id: string | undefined
	export let name: string | undefined
	export let checked = false
	export let labelText: string | undefined
	export let disabled = false


	// Events
	export let onChange: ChangeFn<boolean>


	// Internal state
	import { melt, createSwitch, createSync } from '@melt-ui/svelte'
	
	const {
		elements: { root, input },
		states,
		options,
	} = createSwitch({
		disabled,
		onCheckedChange: onChange,
	})

	$: createSync(states).checked(checked, _ => { checked = _ })

	$: createSync(options).disabled(disabled, _ => { disabled = _ })

	const buttonId = `switch-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`
</script>


<!-- {#if labelText}
	<label
		for="{buttonId}"
		id="{buttonId}-label"
	>
		{labelText}
	</label>
{/if} -->

<button
	use:melt={$root}
	id={buttonId}
	aria-labelledby="{buttonId}-label"
>
	<span class="thumb" />
</button>

<input
	use:melt={$input}
	{id}
	{name}
	on:change
/>


<style>
	:root {
		--switch-default-backgroundColor: #d9d9d940;
		--switch-checked-backgroundColor: var(--accentColor);
		--switch-backgroundColor: #d9d9d988;
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

		flex: 0 0 auto;
		width: var(--switch-width);
		height: var(--switch-height);
		padding: var(--switch-padding);

		background-color: var(--switch-backgroundColor);
		border-radius: var(--switch-height);
		transition: 0.3s var(--transition-easeOutExpo);

		&[data-state='checked'] {
			--switch-backgroundColor: var(--switch-checked-backgroundColor);

			grid-template-columns: 1fr auto 0fr;
		}
	}
	
	.thumb {
		grid-area: thumb;

		/* aspect-ratio: 1;
		@supports not (aspect-ratio: 1) { */
			width: 1.25em;
		/* } */

		background-color: var(--switch-thumb-backgroundColor);
		border-radius: 100%;
		box-shadow: 0 0 0 var(--card-borderWidth) var(--card-borderColor);

		transition: 0.3s var(--transition-easeOutExpo);
	}

	button:active .thumb {
		/* aspect-ratio: 1.1;
		@supports not (aspect-ratio: 1) { */
			width: 1.375em;
		/* } */

		transition-duration: 0.2s;
	}
</style>
