<script lang="ts">
	// Inputs
	export let tagName = 'div'

	// (View options)
	export let layout: 'standalone' | 'nested' = 'standalone'

	// (Parts)
	export let containerProps: Record<string, any> | undefined
	export let viewportProps: Record<string, any> | undefined
	export let contentProps: Record<string, any> | undefined


	// Internal state
	import { melt, createScrollArea } from '@melt-ui/svelte'

	const {
		elements: {
			root,
			viewport,
			content,
			scrollbarX,
			thumbX,
			scrollbarY,
			thumbY,
			corner,
		},
	} = createScrollArea({
		type: 'always',
		hideDelay: 600,
		dir: 'ltr',
	})
</script>


<svelte:element
	this={tagName}
	use:melt={$root}
	{...containerProps}
	data-layout={layout}
>
	<div
		use:melt={$viewport}
		{...viewportProps}
		tabindex="0"
		on:mouseover
		on:focus
		on:mouseout
		on:blur
	>
		<div
			use:melt={$content}
			{...contentProps}
		>
			<slot></slot>
		</div>
	</div>

	<div use:melt={$scrollbarX}>
		<div use:melt={$thumbX}></div>
	</div>

	<div use:melt={$scrollbarY}>
		<div use:melt={$thumbY}></div>
	</div>

	<div use:melt={$corner}></div>
</svelte:element>


<style>
	[data-melt-scroll-area] {
		&[data-layout="standalone"] {
			margin-right: -0.25em;
			padding-right: 0.75em;
		}

		[data-melt-scroll-area-viewport] {
			padding: 1px;
			border-radius: 0.5em;

			[data-melt-scroll-area-content] {
				display: block !important;

				resize: vertical;
				&:not([style^="height:"]):not([style*=";height:"]) {
					max-height: 19.6rem;
				}
			}
		}

		[data-melt-scroll-area-scrollbar] {
			padding: 1px;
			background-color: light-dark(rgba(255, 255, 255, 0.75), rgba(0, 0, 0, 0.75));

			[data-melt-scroll-area-thumb] {
				--melt-scroll-area-thumb-width: 0.4em;
				background-color: light-dark(#c8c8c875, #37373775);
				border-radius: 1em;
			}
		}
	}
</style>
