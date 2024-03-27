<script lang="ts">
	// Types
	import type { MenuItems } from '$lib/menus'
	import type { FloatingConfig } from '@melt-ui/svelte/internal/actions'

	type Value = $$Generic<any>


	// Inputs
	export let items: MenuItems<Value>
	export let labelText: string | undefined

	// (View options)
	export let placement: NonNullable<FloatingConfig>['placement'] = 'bottom-end'


	// Internal state
	import { melt, createDropdownMenu } from '@melt-ui/svelte'

	const {
		elements: { trigger, menu, item, separator, arrow },
		builders: { createSubmenu, createMenuRadioGroup, createCheckboxItem },
		states: { open },
	} = createDropdownMenu({
		positioning: {
			placement,
			fitViewport: true,
		},
	})


	// Actions
	import { enhance } from '$app/forms'


	// Components
	import EllipsisIcon from '$/icons/EllipsisIcon.svelte'
</script>


<button
	use:melt={$trigger}
	aria-label={labelText}
	on:click|stopPropagation
	on:contextmenu={e => { if($open) e.stopPropagation() }}
>
	<slot>
		<EllipsisIcon />
	</slot>
</button>

<div use:melt={$menu}>
	{#each items as subitem}
		{#if 'items' in subitem}
			{#each subitem.items as _subitem, i}
				{#if i > 0}
					<div use:melt={$separator} />
				{/if}

				{#if 'items' in _subitem}
					<!-- TODO: make recursive with Svelte 5 snippets -->
				{:else}
					{#if _subitem.formAction}
						<form
							method="POST"
							action={_subitem.formAction}
							use:enhance={_subitem?.formSubmit}
						>
							<button
								type="submit"
								use:melt={$item}
							>
								<div class="row">
									{_subitem.label}
								</div>
							</button>
						</form>
					{:else}
						<div
							use:melt={$item}
							on:m-click={e => _subitem.onClick?.(_subitem)}
						>
							<div class="row">
								{_subitem.label}
							</div>
						</div>
					{/if}
				{/if}
			{/each}
		{:else}
			{#if subitem.formAction}
				<form
					method="POST"
					action={subitem.formAction}
					use:enhance={subitem?.formSubmit}
				>
					<button
						type="submit"
						use:melt={$item}
					>
						<div class="row">
							{subitem.label}
						</div>
					</button>
				</form>
			{:else}
				<div
					use:melt={$item}
					on:m-click={e => subitem.onClick?.(subitem)}
				>
					<div class="row">
						{subitem.label}
					</div>
				</div>
			{/if}
		{/if}
	{/each}
</div>


<style>
	:root {
		--dropdownMenu-paddingX: 1em;
		--dropdownMenu-paddingY: 0.5em;

		--dropdownMenu-backgroundColor: rgb(255 255 255 / 0.75);
		--dropdownMenu-backdropFilter: blur(3px);
		--dropdownMenu-borderColor: var(--borderColor);
		--dropdownMenu-borderWidth: var(--borderWidth);
		--dropdownMenu-cornerRadius: 0.33em;

		--dropdownMenu-item-selected-backgroundColor: rgba(0, 0, 0, 0.1);
		
		--dropdownMenu-textColor: var(--textColor);
	}

	[data-melt-dropdown-menu-trigger] {
		display: block;
	}

	[data-melt-dropdown-menu] {
		display: grid;

		clip-path: inset(calc(-1 * var(--dropdownMenu-borderWidth)) round calc(var(--dropdownMenu-cornerRadius) + var(--dropdownMenu-borderWidth)));
		background-color: var(--dropdownMenu-backgroundColor);
		backdrop-filter: var(--dropdownMenu-backdropFilter);
		box-shadow: 0 0 0 var(--dropdownMenu-borderWidth) var(--dropdownMenu-borderColor);
		border-radius: var(--dropdownMenu-cornerRadius);

		color: var(--button-textColor);
	}

	[data-melt-dropdown-menu-item] {
		display: flex;
		align-items: center;
		gap: 1ch;

		padding: var(--dropdownMenu-paddingY) var(--dropdownMenu-paddingX);

		&:first-child {
			border-start-start-radius: var(--dropdownMenu-cornerRadius);
			border-start-end-radius: var(--dropdownMenu-cornerRadius);
		}
		&:last-child {
			border-end-start-radius: var(--dropdownMenu-cornerRadius);
			border-end-end-radius: var(--dropdownMenu-cornerRadius);
		}

		cursor: pointer;

		transition: 0.1s;

		&:is(:hover, [data-highlighted]) {
			background-color: var(--dropdownMenu-item-selected-backgroundColor);
		}

		& > * {
			transition: var(--active-transitionOutDuration) var(--transition-easeOutExpo);
		}

		&:active > * {
			transition-duration: var(--active-transitionInDuration);
			opacity: var(--active-opacity);
			scale: var(--active-scale);
		}
	}

	[data-melt-dropdown-menu-separator] {
		height: var(--dropdownMenu-borderWidth);
		margin-inline: var(--dropdownMenu-paddingX);

		background-color: var(--dropdownMenu-borderColor);
	}
</style>
