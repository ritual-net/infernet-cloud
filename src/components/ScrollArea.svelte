<script lang="ts">
	// Inputs
	export let tagName = 'div'
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
>
	<div
		use:melt={$viewport}
		{...viewportProps}
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
		margin-right: -0.25em;
		padding-right: 0.75em;

		[data-melt-scroll-area-viewport] {
			padding: 1px;

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
			background-color: rgba(255, 255, 255, 0.75);

			[data-melt-scroll-area-thumb] {
				--melt-scroll-area-thumb-width: 0.4em;
				background-color: #c8c8c875;
				border-radius: 11em;
			}
		}
	}
</style>
