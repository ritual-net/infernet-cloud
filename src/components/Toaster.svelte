<script lang="ts" context="module">
	// Types
	type ToastData = {
		type?: 'loading' | 'success' | 'error'
		title: string
		description?: string
	}

	export { type Toast } from '@melt-ui/svelte'


	// Internal state
	const {
		elements: { content, title, description, close },
		helpers,
		states: { toasts },
		actions: { portal },
	} = createToaster<ToastData>({
		closeDelay: 10000,
		hover: 'pause-all',
	})
	import { createToaster, melt } from '@melt-ui/svelte'


	// Actions
	export const addToast = helpers.addToast
	export const removeToast = helpers.removeToast


	// Functions
	const format = (string: string) => (
		string
			.replace(/</g, '&lt;')
			.replaceAll(
				/(https?:\/\/[^\s]+)/g,
				url => `<a href="${url}" target="_blank">${url}</a>`
			)
			.replaceAll(/\{.+\}/g, m => `<code>${m}</code>`)
	)


	// Transitions/animations
	import { flip } from 'svelte/animate'
	import { fly } from 'svelte/transition'
	import { expoOut } from 'svelte/easing'
</script>


<div
	use:portal
>
	<div class="column">
		{#each $toasts as { id, data } (id)}
			<div
				use:melt={$content(id)}
				animate:flip={{ duration: 300, easing: expoOut }}
				in:fly={{ duration: 300, x: '100%', easing: expoOut }}
				out:fly={{ duration: 300, x: '100%', easing: expoOut }}
				data-type={data.type}
			>
				<div class="card column">
					<div>
						<button
							type="button"
							use:melt={$close(id)}
							class="small"
						>
							<span>✕</span>
						</button>

						<h4 use:melt={$title(id)}>{data.title}</h4>
					</div>

					{#if data.description}
						<div use:melt={$description(id)}>
							<p>{@html format(String(data.description))}</p>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>


<style>
	:root {
		--toast-default-backgroundColor: var(--card-default-backgroundColor);

		--toast-typeSuccess-backgroundColor: var(--card-typeSuccess-backgroundColor);
		--toast-typeSuccess-borderColor: var(--card-typeSuccess-borderColor);

		--toast-typeError-backgroundColor: var(--card-typeError-backgroundColor);
		--toast-typeError-borderColor: var(--card-typeError-borderColor);
	}

	[data-portal] {
		isolation: isolate;

		overflow: hidden auto;

		position: fixed;
		right: 0;
		bottom: 0;
		max-height: 100dvh;
		padding: 1em;

		> div {
			align-content: end;

			& [data-melt-toast-content] {
				--toast-backgroundColor: var(--toast-default-backgroundColor);
				--toast-borderColor: var(--borderColor);

				&[data-type="loading"] {
					cursor: progress;
				}

				&[data-type="success"] {
					--toast-backgroundColor: var(--toast-typeSuccess-backgroundColor);
					--toast-borderColor: var(--toast-typeSuccess-borderColor);
				}

				&[data-type="error"] {
					--toast-backgroundColor: var(--toast-typeError-backgroundColor);
					--toast-borderColor: var(--toast-typeError-borderColor);
				}

				position: relative;

				& [data-melt-toast-description] {
					overflow-y: auto;
					max-height: 16lh;
					white-space: pre-wrap;
					word-break: break-word;
				}

				& .card {
					--card-backgroundColor: var(--toast-backgroundColor);
					--card-borderColor: var(--toast-borderColor);
					--card-paddingY: 0.75em;
					--card-paddingX: 1em;

					backdrop-filter: var(--backdropFilter);

					width: min(35ch, 100vw - 2rem);
					row-gap: 0.25em;

					transition: 0.3s;

					& > div {
						row-gap: 0.25em;
					}
				}

				[data-melt-toast-close] {
					--button-paddingX: 0.25em;
					--button-paddingY: 0.25em;
					--button-borderWidth: 0px;

					float: right;
					margin-left: 0.5em;
					margin-right: calc(-1 * var(--card-paddingX) + var(--card-paddingY));

					& span {
						display: inline-block;
						width: 1lh;
					}
				}
				&:is([data-type="success"], [data-type="error"]) [data-melt-toast-close] {
					--button-backgroundColor: transparent;
				}
			}
		}
	}
</style>