<script lang="ts">
	// Inputs
	export let tagName = 'div'
	export let containerProps: Record<string, any> | undefined
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
	<div use:melt={$viewport}>
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
</svelte:element>


<style>
	[data-melt-scroll-area-viewport] {
		padding: 1px;
		padding-right: 0.66em;

		resize: vertical;
		&:not([style*="height"]) {
			max-height: 19.6rem;
		}
	}

	[data-melt-scroll-area-scrollbar] {
		background-color: rgba(255, 255, 255, 0.75);
	}

	[data-melt-scroll-area-thumb] {
		--melt-scroll-area-thumb-width: 0.33em;
		background-color: #c8c8c875;
		border-radius: 11em;
	}
</style>
