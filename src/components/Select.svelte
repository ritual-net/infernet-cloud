<script lang="ts">
	// Types
	import type { MenuItems } from '$lib/menus'
	import type { FloatingConfig } from '@melt-ui/svelte/internal/actions'

	type Value = $$Generic<any>


	// Inputs
	export let value: Value | undefined
	export let items: MenuItems<Value>

	export let labelText: string | undefined
	export let placeholder: string = 'Select...'

	export let id: string | undefined
	export let name: string | undefined
	export let required: boolean = false
	export let disabled: boolean = false
	export let multiple: boolean = false

	// (View options)
	export let placement: NonNullable<FloatingConfig>['placement'] = 'bottom-end'



	// Internal state
	import { melt, createSelect, createSync } from '@melt-ui/svelte'

	const {
		elements: { trigger, menu, option, group, groupLabel, label, hiddenInput },
		states,
		options,
		helpers: { isSelected },
	} = createSelect<Value>({
		name,
		required,
		disabled,
		multiple,

		forceVisible: true,
		positioning: {
			placement,
			fitViewport: true,
		},
	})

	const {
		open,
		selectedLabel,
		selected,
	} = states

	$: createSync(states).selected(
		items.flatMap(itemOrGroup => 'items' in itemOrGroup ? itemOrGroup.items : itemOrGroup).find(item => 'value' in item && item.value === value),
		selected => { value = selected?.value as Value },
	)

	$: createSync(options).disabled(
		disabled,
		_ => { disabled = _ },
	)

	let triggerElement: Element
</script>


<div class="stack">
	<input
		type="text"
		{id}
		use:melt={$hiddenInput}
		on:focus={() => triggerElement.click()}
	/>

	{#if labelText}
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<!-- <label use:melt={$label}>{labelText}</label> -->
	{/if}

	<button
		type="button"
		use:melt={$trigger}
		aria-label={labelText}
		class="row"
		bind:this={triggerElement}
	>
		{#if $selected?.icon}
			<img src={$selected.icon} />
		{/if}

		{#if $selectedLabel}
			<span>{$selectedLabel}</span>
		{:else}
			<span class="placeholder">{placeholder}</span>
		{/if}
	</button>

	{#if $open}
		<div
			use:melt={$menu}
		>
			{#each items as item (item.value)}
				{#if 'items' in item}
					<div use:melt={$group(String(item.value))}>
						<div
							class="row"
							use:melt={$groupLabel(item.label)}
						>
							<div class="row">
								{#if item.icon}
									<img src={item.icon} />
								{/if}

								{item.label}
							</div>
						</div>

						{#each item.items as subitem}
							{#if 'items' in subitem}
								<!-- TODO: make recursive with Svelte 5 snippets -->
							{:else}
								<div
									class="row"
									use:melt={$option({
										value: subitem.value,
										label: subitem.label,
										disabled: subitem.disabled,
									})}
								>
									<div class="row">
										{#if subitem.icon}
											<img src={item.icon} />
										{/if}

										<span>{subitem.label}</span>
									</div>
								</div>
							{/if}
						{/each}
					</div>
				{:else}
					<div
						class="row"
						use:melt={$option({
							value: item.value,
							label: item.label,
							disabled: item.disabled,
						})}
					>
						<div class="row">
							{#if item.icon}
								<img src={item.icon} />
							{/if}

							<span>{item.label}</span>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>


<style>
	:root {
		--select-paddingX: 1em;
		--select-paddingY: 0.5em;
		--select-groupItem-indentX: 1.5em;

		--select-backgroundColor: rgb(255 255 255 / 0.75);
		--select-backdropFilter: blur(3px);
		--select-borderColor: var(--borderColor);
		--select-borderWidth: var(--borderWidth);
		--select-cornerRadius: 0.33em;

		--select-item-selected-backgroundColor: rgba(0, 0, 0, 0.1);
		
		--select-textColor: var(--textColor);
	}

	[data-melt-select-trigger] {
		display: inline-flex;
		align-items: center;
		gap: 1ch;

		cursor: context-menu;

		&:after {
			content: '▾';
			width: 1em;
			flex: 0 auto;
			margin-right: -0.25em;
			text-align: center;
		}
	}

	[data-melt-select-menu] {
		z-index: 1;
		overflow-y: auto;

		display: grid;

		clip-path: inset(calc(-1 * var(--select-borderWidth)) round calc(var(--select-cornerRadius) + var(--select-borderWidth)));
		background-color: var(--select-backgroundColor);
		backdrop-filter: var(--select-backdropFilter);
		box-shadow: 0 0 0 var(--select-borderWidth) var(--select-borderColor);
		border-radius: var(--select-cornerRadius);

		color: var(--button-textColor);
	}

	[data-melt-select-group] {
		display: grid;

		& [data-melt-select-group-label] {
			position: sticky;
			top: 0;
			backdrop-filter: blur(3px);
			background-color: var(--combobox-backgroundColor);
			padding: var(--combobox-paddingY) var(--combobox-paddingX);

			font-weight: bold;
			font-size: 0.85em;
		}

		& [data-melt-select-option] {
			padding-left: calc(var(--select-paddingX) + var(--select-groupItem-indentX));
		}
	}

	[data-melt-select-option] {
		display: flex;
		align-items: center;
		gap: 1ch;

		padding: var(--select-paddingY) var(--select-paddingX);

		&:first-child {
			border-start-start-radius: var(--select-cornerRadius);
			border-start-end-radius: var(--select-cornerRadius);
		}
		&:last-child {
			border-end-start-radius: var(--select-cornerRadius);
			border-end-end-radius: var(--select-cornerRadius);
		}

		cursor: pointer;

		transition: 0.1s;

		&:is(:hover, [data-highlighted]) {
			background-color: var(--select-item-selected-backgroundColor);
		}

		& > * {
			gap: 1ch;
			transition: var(--active-transitionOutDuration) var(--transition-easeOutExpo);
		}

		&:active > * {
			transition-duration: var(--active-transitionInDuration);
			opacity: var(--active-opacity);
			scale: var(--active-scale);
		}

		&[data-selected]:after {
			content: '✓';
			width: 1em;
			flex: 0 auto;
			margin-right: -0.25em;
			text-align: center;
		}
	}

	[data-melt-select-hidden-input]	{
		display: block;
		position: static !important;
		transform: none !important;
		min-width: 100%;
		width: 0;
	}

	img {
		width: 1.5em;
		height: 1.5em;
		object-fit: contain;
	}

	.placeholder {
		opacity: 0.5;
	}
</style>
