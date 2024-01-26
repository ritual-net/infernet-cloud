<script lang="ts">
	// Types
	type TabId = $$Generic<string | number>


	// Inputs
	export let items: {
		id: TabId,
		label?: string,
	}[]
	export let value: TabId | undefined
	export let labelText: string

	// (View options)
	export let orientation: 'horizontal' | 'vertical' = 'horizontal'
	let className = ''
	export { className as class }


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


	// Transitions/animations
	import { crossfade } from 'svelte/transition'
	import { cubicInOut } from 'svelte/easing'

	const [indicatorIn, indicatorOut] = crossfade({
		duration: 250,
		easing: cubicInOut,
	})
</script>


<div
	use:melt={$root}
>
	<div
		use:melt={$list}
		aria-label={labelText}
	>
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
	</div>

	{#each items as item}
		<div
			use:melt={$content(String(item.id))}
		>
			<slot name="content" {item} />
		</div>
	{/each}
</div>


<style>
	[data-melt-tabs] {
		display: grid;

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
	}
	.trigger-indicator {
		position: absolute;
		inset: 0;
		z-index: 1;

		pointer-events: none;
	}
	[data-melt-tabs-trigger][data-orientation="horizontal"] .trigger-indicator {
		border-bottom: var(--color-ritualBlack) 2px solid;
	}
	[data-melt-tabs-trigger][data-orientation="vertical"] .trigger-indicator {
		border-right: var(--color-ritualBlack) 2px solid;
	}

	[data-melt-tabs-content] {
		grid-area: tabs-content;
		display: block;

		transition-duration: 0.3s;

		&[hidden] {
			z-index: -1;
			pointer-events: none;

			scale: 0.95;
			opacity: 0;
			filter: blur(2px);
		}
	}
</style>
