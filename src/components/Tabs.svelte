<script lang="ts">
	// Inputs
	export let items: {
		id: string,
		label?: string,
	}[]

	// (View options)
	export let orientation: 'horizontal' | 'vertical' = 'horizontal'
	let className = ''
	export { className as class }


	// Internal state
	import { melt, createTabs, createSync } from '@melt-ui/svelte'

	const {
		elements: { root, list, content, trigger },
		states: { value },
		options,
	} = createTabs({
		orientation,
		defaultValue: items[0]?.id,
	})

	const sync = createSync(options)
  	$: sync.orientation(orientation, value => { orientation = value })


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
		aria-label="Manage your account"
	>
		{#each items as item}
			<button
				use:melt={$trigger(item.id)}
			>
				{item.label}

				{#if $value === item.id}
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
			use:melt={$content(item.id)}
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
		border-bottom: var(--ritual-black) 2px solid;
	}
	[data-melt-tabs-trigger][data-orientation="vertical"] .trigger-indicator {
		border-right: var(--ritual-black) 2px solid;
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
