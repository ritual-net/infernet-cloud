<script lang="ts">
	// Types
	import type { FloatingConfig } from '@melt-ui/svelte/internal/actions'

	type Item<Value> = {
		value: Value,
		label: string,
		disabled?: boolean,
		icon?: string,
	}
	type ItemGroup<Value> = {
		value?: Value,
		label: string,
		items: Items<Value>,
		disabled?: boolean,
	}
	type Items<Value> = (Item<Value> | ItemGroup<Value>)[]

	type Value = $$Generic<any>


	// Inputs
	export let value: Value | undefined
	export let items: Items<Value>

	export let labelText: string | undefined
	export let placeholder: string = 'Select...'

	export let name: string | undefined
	export let required: boolean = false
	export let disabled: boolean = false
	export let multiple: boolean = false

	// (View options)
	export let placement: NonNullable<FloatingConfig>['placement'] = 'bottom-end'



	// Internal state
	import { melt, createSelect, createSync } from '@melt-ui/svelte'

	const {
		elements: { trigger, menu, option, group, groupLabel, label },
		states,
		helpers: { isSelected },
	} = createSelect({
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
	} = states

	$: createSync(states).selected(
		items.flatMap(itemOrGroup => 'items' in itemOrGroup ? itemOrGroup.items : itemOrGroup).find(item => 'value' in item && item.value === value),
		selected => { value = selected.value as Value },
	)
</script>


<div>
	{#if labelText}
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label use:melt={$label}>{labelText}</label>
	{/if}

	<button
		type="button"
		use:melt={$trigger}
		aria-label={labelText}
	>
		{$selectedLabel || placeholder}
	</button>

	{#if $open}
		<div
			use:melt={$menu}
		>
			{#each items as item (item.value)}
				{#if 'items' in item}
					<div use:melt={$group(item.value)}>
						<div
							use:melt={$groupLabel(item.label)}
						>
							<div class="row">
								{#if item.icon}
									{item.icon}
								{/if}

								{item.label}
							</div>
						</div>

						{#each item.items as subitem}
							<div
								use:melt={$option({
									value: subitem.value,
									label: subitem.label,
									disabled: subitem.disabled,
								})}
							>
								<div class="row">
									{#if subitem.icon}
										{subitem.icon}
									{/if}

									<span>{subitem.label}</span>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div
						use:melt={$option({
							value: item.value,
							label: item.label,
							disabled: item.disabled,
						})}
					>
						<div class="row">
							{#if item.icon}
								{item.icon}
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
		--select-groupOption-indentX: 1.5em;

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
		display: grid;

		clip-path: inset(calc(-1 * var(--select-borderWidth)) round calc(var(--select-cornerRadius) + var(--select-borderWidth)));
		background-color: var(--select-backgroundColor);
		backdrop-filter: var(--select-backdropFilter);
		box-shadow: 0 0 0 var(--select-borderWidth) var(--select-borderColor);
		border-radius: var(--select-cornerRadius);

		color: var(--button-textColor);

		cursor: pointer;
	}

	[data-melt-select-group] {
		display: grid;

		& [data-melt-select-group-label] {
			font-weight: bold;
			padding: var(--select-paddingY) var(--select-paddingX);
		}

		& [data-melt-select-option] {
			padding-left: calc(var(--select-paddingX) + var(--select-groupOption-indentX));
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
			transition: 0.15s var(--ease-out-expo);
		}

		&:active > * {
			scale: 0.96;
			opacity: 0.75;
			transition-duration: 0.1s;
		}

		&[data-selected] > *:after {
			content: '✓';
			width: 1em;
			flex: 0 auto;
			margin-right: -0.25em;
			text-align: center;
		}
	}
</style>
