<script lang="ts">
	// Types
	type TabId = $$Generic<string | number>


	// Inputs
	export let items: {
		id: TabId
		label?: string
	}[]
	export let value: TabId | undefined
	export let labelText: string

	// (View options)
	export let orientation: 'horizontal' | 'vertical' = 'horizontal'
	let className = ''
	export { className as class }

	export let layout: 'default' | 'tooltip-dots' = 'default'


	// Internal state
	import { melt, createTabs, createSync } from '@melt-ui/svelte'

	const {
		elements: { root, list, content, trigger },
		states,
		options,
	} = createTabs({
		orientation,
		defaultValue: String(value ?? items[0]?.id),
	})

	$: createSync(states).value(String(value), _ => { value = _ as TabId })
	$: createSync(options).orientation(orientation, _ => { orientation = _ })


	// Components
	import Tooltip from './Tooltip.svelte'


	// Transitions/animations
	import SizeTransition from './SizeTransition.svelte'

	import { crossfade } from 'svelte/transition'
	import { cubicInOut } from 'svelte/easing'

	const [indicatorIn, indicatorOut] = crossfade({
		duration: 250,
		easing: cubicInOut,
	})
</script>


<SizeTransition>
	<div
		use:melt={$root}
		data-layout={layout}
	>
		<div
			use:melt={$list}
			aria-label={labelText}
		>
			{#if layout === 'default'}
				{#each items as item (item.id)}
					<button
						type="button"
						use:melt={$trigger(String(item.id))}
					>
						{item.label}

						{#if String(value) === String(item.id)}
							<div
								class="trigger-indicator"
								in:indicatorIn={{ key: 'trigger' }}
								out:indicatorOut={{ key: 'trigger' }}
							/>
						{/if}
					</button>
				{/each}

			{:else if layout === 'tooltip-dots'}
				{#each items as item (item.id)}
					<Tooltip
						labelText={item.label}
					>
						<button
							type="button"
							use:melt={$trigger(String(item.id))}
						>
							{#if String(value) === String(item.id)}
								<div
									class="trigger-indicator"
									in:indicatorIn={{ key: 'trigger' }}
									out:indicatorOut={{ key: 'trigger' }}
								/>
							{/if}
						</button>

						<svelte:fragment slot="content">
							{item.label}
						</svelte:fragment>
					</Tooltip>
				{/each}
			{/if}
		</div>

		{#each items as item}
			<div
				use:melt={$content(String(item.id))}
				on:focus|capture={(e) => {
					value = item.id
				}}
			>
				<slot name="content" {item} />
			</div>
		{/each}
	</div>
</SizeTransition>


<style>
	[data-melt-tabs] {
		--tabs-accentColor: var(--accentColor);

		isolation: isolate;

		display: grid;
		gap: var(--borderWidth);

		&[data-orientation="horizontal"] {
			grid:
				'tabs-list' auto
				'tabs-content' 1fr
			;
		}

		&[data-orientation="vertical"] {
			grid:
				'tabs-list tabs-content'
				/ auto 1fr
			;
		}
	}

	[data-melt-tabs-list] {
		grid-area: tabs-list;
		position: relative;

		&[data-orientation="horizontal"] {
			display: flex;
		}

		&[data-orientation="vertical"] {
			display: grid;
		}
	}

	[data-melt-tabs-trigger] {
		position: relative;
		box-shadow: none;

		& .trigger-indicator {
			position: absolute;
			inset: 0;
			z-index: 1;

			pointer-events: none;
		}
		&[data-orientation="horizontal"] .trigger-indicator {
			border-bottom: var(--tabs-accentColor) 2px solid;
		}
		&[data-orientation="vertical"] .trigger-indicator {
			border-right: var(--tabs-accentColor) 2px solid;
		}
	}

	[data-melt-tabs-content] {
		grid-area: tabs-content;
		display: block;

		transition-duration: 0.3s;
		height: max-height;

		&[hidden] {
			z-index: -1;
			pointer-events: none;

			height: 0;
			scale: 0.95;
			opacity: 0;
			filter: blur(2px);
		}
	}


	[data-melt-tabs][data-layout="tooltip-dots"] {
		grid:
			'.' 1fr
			/ [tabs-list-start tabs-content] 1fr [tabs-list-end tabs-content-end]
		;

		& > [data-melt-tabs-list] {
			place-self: start end;

			gap: 0.66em;
			padding-block: 0.75em;

			/* & > * > [data-melt-tabs-trigger] { */
			:global(& > * > [data-melt-tabs-trigger]) {
				--button-paddingX: 5px;
				--button-paddingY: 5px;
				/* --button-backgroundColor: hsl(from var(--textColor) h s l / 0.16); */
				--button-backgroundColor: light-dark(rgba(0, 0, 0, 0.16), rgba(255, 255, 255, 0.16));
				--button-borderWidth: 0;
				--button-cornerRadius: 100%;

				& > .trigger-indicator {
					background-color: var(--textColor);
					border: none;
					border-radius: inherit;
				}
			}
		}
	}
</style>
