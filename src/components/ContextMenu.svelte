<script lang="ts">
	// Types
	import type { MenuItems } from '$lib/menus'
	import type { FloatingConfig } from '@melt-ui/svelte/internal/actions'

	type Value = $$Generic<any>


	// Inputs
	export let items: MenuItems<Value> | undefined
	export let labelText: string | undefined

	// (View options)
	export let placement: NonNullable<FloatingConfig>['placement'] = 'bottom-start'


	// Internal state
	import { melt, createContextMenu } from '@melt-ui/svelte'

	const {
		elements: { trigger, menu, item, separator },
		builders: { createSubmenu, createMenuRadioGroup, createCheckboxItem },
	} = createContextMenu({
		positioning: {
			placement,
			fitViewport: true,
		},

		closeOnOutsideClick: true,
		closeOnEscape: true,
	})


	// Actions
	import { enhance } from '$app/forms'
</script>


<!-- <div
	use:melt={$trigger}
	aria-label={labelText}
> -->
	<slot
		trigger={$trigger}
		aria-label={labelText}
	/>
<!-- </div> -->

<div use:melt={$menu}>
	{#each items ?? [] as subitem}
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
							method={_subitem.formMethod ?? 'POST'}
							action={_subitem.formAction}
							use:enhance={_subitem?.formSubmit}
						>
							<button
								type="submit"
								class:destructive={_subitem.isDestructive}
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
							class:destructive={_subitem.isDestructive}
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
					method={subitem.formMethod ?? 'POST'}
					action={subitem.formAction}
					use:enhance={subitem?.formSubmit}
				>
					<button
						type="submit"
						use:melt={$item}
						class:destructive={subitem.isDestructive}
					>
						<div class="row">
							{subitem.label}
						</div>
					</button>
				</form>
			{:else}
				<div
					use:melt={$item}
					class:destructive={subitem.isDestructive}
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
		--contextMenu-paddingX: 1em;
		--contextMenu-paddingY: 0.5em;

		--contextMenu-backgroundColor: light-dark(rgb(255 255 255 / 0.75), rgb(0 0 0 / 0.75));
		--contextMenu-backdropFilter: blur(20px);
		--contextMenu-borderColor: var(--borderColor);
		--contextMenu-borderWidth: var(--borderWidth);
		--contextMenu-cornerRadius: 0.33em;

		--contextMenu-item-selected-backgroundColor: light-dark(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.1));
		
		--contextMenu-textColor: var(--textColor);
	}

	/* [data-melt-context-menu-trigger] {
		display: contents;
	} */
	:global([data-melt-context-menu-trigger]) {
		cursor: context-menu;
	}

	[data-melt-context-menu] {
		display: grid;

		clip-path: inset(calc(-1 * var(--contextMenu-borderWidth)) round calc(var(--contextMenu-cornerRadius) + var(--contextMenu-borderWidth)));
		background-color: var(--contextMenu-backgroundColor);
		backdrop-filter: var(--contextMenu-backdropFilter);
		box-shadow: 0 0 0 var(--contextMenu-borderWidth) var(--contextMenu-borderColor);
		border-radius: var(--contextMenu-cornerRadius);

		color: var(--button-textColor);
	}

	[data-melt-context-menu-item] {
		display: flex;
		align-items: center;
		gap: 1ch;

		padding: var(--contextMenu-paddingY) var(--contextMenu-paddingX);

		&:first-child {
			border-start-start-radius: var(--contextMenu-cornerRadius);
			border-start-end-radius: var(--contextMenu-cornerRadius);
		}
		&:last-child {
			border-end-start-radius: var(--contextMenu-cornerRadius);
			border-end-end-radius: var(--contextMenu-cornerRadius);
		}

		cursor: pointer;

		transition: 0.1s;

		&.destructive {
			color: var(--color-destructive);
		}

		&:is(:hover, [data-highlighted]) {
			background-color: var(--contextMenu-item-selected-backgroundColor);
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

	[data-melt-context-menu-separator] {
		height: var(--contextMenu-borderWidth);
		margin-inline: var(--contextMenu-paddingX);

		background-color: var(--contextMenu-borderColor);
	}

	form {
		display: contents;

		& button {
			--button-backgroundColor: transparent;
			--button-borderWidth: 0px;
			--button-cornerRadius: 0px;
		}
	}
</style>
