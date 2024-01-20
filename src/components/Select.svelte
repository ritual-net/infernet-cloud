<script lang="ts">
	// Types
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
			placement: 'bottom',
			fitViewport: true,
			sameWidth: true,
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
							class="row"
						>
							{#if item.icon}
								{item.icon}
							{/if}

							{item.label}
						</div>

						{#each item.items as subitem}
							<div
								use:melt={$option({
									value: subitem.value,
									label: subitem.label,
									disabled: subitem.disabled,
								})}
								class="row"
							>
								{#if subitem.icon}
									{subitem.icon}
								{/if}

								{subitem.label}
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
						class="row"
					>
						{#if item.icon}
							{item.icon}
						{/if}
						{item.label}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>


<style>
	:root {
		--select-borderColor: var(--borderColor);
		--select-borderWidth: var(--borderWidth);
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

		backdrop-filter: blur(3px);
		background-color: rgba(255, 255, 255, 0.5);

		background-color: var(--select-backgroundColor);
		box-shadow: 0 0 0 var(--select-borderWidth) var(--select-borderColor);
		border-radius: 0.33em;

		color: var(--button-textColor);

		cursor: pointer;
	}

	[data-melt-select-group] {
		display: grid;

		& [data-melt-select-group-label] {
			font-weight: bold;
			padding: 0.5em 1em;
		}

		& [data-melt-select-option] {
			padding-left: 2em;
		}
	}

	[data-melt-select-option] {
		display: flex;
		align-items: center;
		gap: 1ch;

		padding: 0.5em 1em;

		cursor: pointer;

		transition: 0.1s;

		&:active {
			scale: 0.97;
			opacity: 0.9;

			transition-duration: 0.05s;
		}

		&:hover, &[data-highlighted] {
			background-color: rgba(0, 0, 0, 0.1);
			filter: brightness(120%);
		}

		&[data-selected]:after {
			content: '✓';
			width: 1em;
			flex: 0 auto;
			margin-right: -0.25em;
			text-align: center;
		}
	}
</style>
