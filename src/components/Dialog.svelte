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

		display: grid;
		grid:
			'.'
			/ min(50rem, 100%)
		;
		place-content: center;
		padding: 1.5rem;

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
	}
</style>
