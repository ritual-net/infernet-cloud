<script lang="ts">
	// Types
	type Value = $$Generic<any>


	// Inputs
	export let open: boolean
	export let title: string
	export let description: string | undefined
	export let showTrigger = false
	export let closeOnOutsideClick = false


	// Internal state
	import { melt, createDialog, createSync } from '@melt-ui/svelte'
	
	const {
		elements: {
			trigger,
			overlay,
			content,
			title: titleElement,
			description: descriptionElement,
			close,
			portalled,
		},
		states,
	} = createDialog({
		forceVisible: true,
		closeOnOutsideClick,
	})

	$: createSync(states).open(
		open,
		_ => { open = _ },
	)


	// Events
	export let onClose: () => void


	// Transitions/animations
	// import { scale } from 'svelte/transition'
</script>


{#if showTrigger}
	<button
		type="button"
		use:melt={$trigger}
	>
		<slot name="trigger" />
	</button>
{/if}

<div
	use:melt={$portalled}
>
	{#if open}
		<div use:melt={$overlay} />

		<div
			class="column"
			use:melt={$content}
		>
			<header class="row">
				<div class="column">
					{#if title}
						<h2 use:melt={$titleElement}>
							<slot name="title">
								{title}
							</slot>
						</h2>
					{/if}

					{#if description}
						<p use:melt={$descriptionElement}>
							<slot name="description">
								{description}
							</slot>
						</p>
					{/if}
				</div>

				<button
					use:melt={$close}
					aria-label="close"
					on:m-click={onClose}
				>
					✕
				</button>
			</header>

			<slot
				close={$close}
			/>
		</div>
	{/if}
</div>


<style>
	[data-melt-dialog-portalled] {
		isolation: isolate;
		z-index: 1;
		position: fixed;
		inset: 0;
		pointer-events: none;

		overflow-y: auto;

		display: grid;
		grid:
			'.' 100dvh
			/ min(50rem, 100%)
		;
		justify-content: center;
		align-items: start;
		align-items: safe center;

		transition: 0.3s var(--transition-easeOutExpo);

		&[data-state="closed"] {
			opacity: 0;
			backdrop-filter: blur(10px);
		}
	}

	[data-melt-dialog-overlay] {
		z-index: -1;
		position: fixed;
		inset: 0;

		background-color: rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(10px);

		pointer-events: all;
	}

	[data-melt-dialog-content] {
		pointer-events: all;

		grid:
			'.' auto
			'.' auto
		;

		height: min-content;
		padding: 1.5rem;
	}

	/* header {
		position: sticky;
		top: 0;
		z-index: 1;
		backdrop-filter: blur(8px);
	} */
</style>
