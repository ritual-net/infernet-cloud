<script lang="ts">
	// Types
	import type { MenuItem, MenuItems } from '$lib/menus'
	import type { FloatingConfig } from '@melt-ui/svelte/internal/actions'

	type Value = $$Generic<any>


	// Inputs
	export let value: Value | undefined
	export let inputValue: string = ''
	export let items: MenuItems<Value>

	export let labelText: string | undefined
	export let placeholder: string = 'Select...'

	export let id: string | undefined
	export let name: string | undefined
	export let required: boolean = false
	export let disabled: boolean = false
	export let multiple: boolean = false

	// (View options)
	export let visuallyDisabled = false
	export let placement: NonNullable<FloatingConfig>['placement'] = 'bottom-end'


	// Internal state
	import { melt, createCombobox, createSync } from '@melt-ui/svelte'

	const {
		elements: { input, menu, option, group, groupLabel, label, hiddenInput },
		states,
		options,
		helpers: { isSelected },
	} = createCombobox<Value>({
		name,
		required,
		disabled,
		multiple,

		forceVisible: true,
		positioning: {
			placement,
			fitViewport: true,
			boundary: document.getElementsByTagName('main')[0],
		},

		onSelectedChange: ({ curr, next }) => {
			if(curr === undefined && next === undefined) return

			const selectedItem = Array.isArray(next) ? next[0] : next
			inputValue = selectedItem ? selectedItem.value : ''
			return next
		},
	})

	const {
		open,
		touchedInput,
		selected,
	} = states

	$: createSync(states).inputValue(
		inputValue,
		_ => { inputValue = _ },
	)

	$: createSync(states).selected(
		items.flatMap(itemOrGroup => 'items' in itemOrGroup ? itemOrGroup.items : itemOrGroup).find(item => 'value' in item && item.value === value),
		selected => { value = selected?.value as Value },
	)

	$: createSync(options).required(
		required,
		_ => { required = _ },
	)

	$: createSync(options).disabled(
		disabled,
		_ => { disabled = _ },
	)

	// (Computed)
	const itemMatchesInput = (
		item: MenuItem<Value>,
		input: string,
	) => {
		const normalizedInput = input.toLowerCase()

		return (
			String(item.value).toLowerCase().includes(normalizedInput)
			|| item.label.toLowerCase().includes(normalizedInput)
		)
	}

	const filterItems = (
		items: MenuItems<Value>,
		input: string,
	): MenuItems<Value> => (
		items
			.map(item => (
				'items' in item ?
					{
						...item,
						items: filterItems(item.items, input),
					}
				: itemMatchesInput(item, input) ?
					item
				:
					undefined
			))
			.filter(item => (
				!item ?
					false
				: 'items' in item ?
					item.items.length > 0
				:
					true
			))
	) as MenuItems<Value>

	$: filteredItems = filterItems(items, inputValue)
	// $: filteredItems = $touchedInput
	// 	? filterItems(items, inputValue)
	// 	: items
</script>


<div class="container">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<!-- <label use:melt={$label}>
		{labelText}
	</label> -->

	<div class="stack">
		<input
			type="text"
			aria-disabled={visuallyDisabled ? true : undefined}
			use:melt={$input}
			{placeholder}
			{name}
		/>
	</div>
</div>

{#if $open}
	<ul use:melt={$menu}>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div tabindex="0">
			{#each filteredItems as item (item.value)}
				{#if 'items' in item}
					<li use:melt={$group(String(item.value))}>
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
					</li>
				{:else}
					<li
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
					</li>
				{/if}
			{:else}
				<li class="placeholder">No results found.</li>
			{/each}
		</div>
	</ul>
{/if}


<style>
	
	:root {
		--combobox-minWidth: 20rem;
		--combobox-paddingX: 1em;
		--combobox-paddingY: 0.5em;
		--combobox-groupItem-indentX: 1.5em;

		--combobox-backgroundColor: rgb(255 255 255 / 0.75);
		--combobox-backdropFilter: blur(3px);
		--combobox-borderColor: var(--borderColor);
		--combobox-borderWidth: var(--borderWidth);
		--combobox-cornerRadius: 0.33em;

		--combobox-item-selected-backgroundColor: rgba(0, 0, 0, 0.1);

		--combobox-textColor: var(--textColor);
	}

	.container {
		min-width: min(var(--combobox-minWidth), 100%);
	}

	div:has(> [data-melt-combobox-trigger]) {
		display: grid;
		align-items: center;
		justify-items: end;
		align-items: center;
		gap: 1ch;

		cursor: context-menu;

		&:after {
			margin: var(--borderWidth);
			padding: var(--combobox-paddingY) calc(var(--combobox-paddingX) - 0.25em);
			overflow: hidden;
			border-radius: 0.33em;

			content: '▾';
			width: 1em;
			flex: 0 auto;
			text-align: center;

			backdrop-filter: blur(8px);
			background-color: var(--combobox-backgroundColor);

			pointer-events: none;
		}
	}

	[data-melt-combobox-menu] {
		z-index: 1;
		overflow-y: auto;

		display: grid;
		padding-inline-start: 0;

		clip-path: inset(calc(-1 * var(--combobox-borderWidth)) round calc(var(--combobox-cornerRadius) + var(--combobox-borderWidth)));
		background-color: var(--combobox-backgroundColor);
		backdrop-filter: var(--combobox-backdropFilter);
		box-shadow: 0 0 0 var(--combobox-borderWidth) var(--combobox-borderColor);
		border-radius: var(--combobox-cornerRadius);

		color: var(--button-textColor);
	}

	[data-melt-combobox-group] {
		display: grid;

		& [data-melt-combobox-group-label] {
			position: sticky;
			top: 0;
			backdrop-filter: blur(3px);
			background-color: var(--combobox-backgroundColor);
			padding: var(--combobox-paddingY) var(--combobox-paddingX);

			font-weight: bold;
			font-size: 0.85em;
		}

		& [data-melt-combobox-option] {
			padding-left: calc(var(--combobox-paddingX) + var(--combobox-groupItem-indentX));
		}
	}

	[data-melt-combobox-option] {
		display: flex;
		align-items: center;
		gap: 1ch;

		padding: var(--combobox-paddingY) var(--combobox-paddingX);

		&:first-child {
			border-start-start-radius: var(--combobox-cornerRadius);
			border-start-end-radius: var(--combobox-cornerRadius);
		}
		&:last-child {
			border-end-start-radius: var(--combobox-cornerRadius);
			border-end-end-radius: var(--combobox-cornerRadius);
		}

		cursor: pointer;

		transition: 0.1s;

		&:is(:hover, [data-highlighted]) {
			background-color: var(--combobox-item-selected-backgroundColor);
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

	[data-melt-combobox-hidden-input]	{
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
		display: block;
		padding: var(--combobox-paddingY) var(--combobox-paddingX);
		opacity: 0.5;
	}
</style>
