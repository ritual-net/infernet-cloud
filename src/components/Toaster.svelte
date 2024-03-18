<script lang="ts" context="module">
	// Types
	type ToastData = {
		type?: 'default' | 'success' | 'error',
		title: string,
		description?: string,
	}


	// Internal state
	const {
		elements: { content, title, description, close },
		helpers,
		states: { toasts },
		actions: { portal },
	} = createToaster<ToastData>({
		closeDelay: 100000,
	})
	import { createToaster, melt } from '@melt-ui/svelte'


	// Actions
	export const addToast = helpers.addToast


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
							use:melt={$close(id)}
							class="small"
						>
							<span>✕</span>
						</button>

						<h4 use:melt={$title(id)}>{data.title}</h4>
					</div>

					{#if data.description}
						<div use:melt={$description(id)}>
							<p>{@html data.description.replaceAll(/\{.+\}/g, m => `<code>${m.replace(/</g, '&lt;')}</code>`)}</p>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>


<style>
	:root {
		--toast-typeSuccess-backgroundColor: rgb(246, 255, 246);
		--toast-typeSuccess-borderColor: rgba(0, 255, 0, 0.2);

		--toast-typeError-backgroundColor: rgb(255, 246, 246);
		--toast-typeError-borderColor: rgba(255, 0, 0, 0.2);
	}

	[data-portal] {
		isolation: isolate;

		position: fixed;
		right: 1em;
		bottom: 1em;
		max-height: 100dvh;

		overflow-y: auto;

		padding: var(--borderWidth);

		> div {
			align-content: end;

			& [data-melt-toast-content] {
				--toast-backgroundColor: #fff;
				--toast-borderColor: #fff;

				&[data-type="success"] {
					--toast-backgroundColor: var(--toast-typeSuccess-backgroundColor);
					--toast-borderColor: var(--toast-typeSuccess-borderColor);
				}

				&[data-type="error"] {
					--toast-backgroundColor: var(--toast-typeError-backgroundColor);
					--toast-borderColor: var(--toast-typeError-borderColor);
				}

				position: relative;

				& .card {
					--card-backgroundColor: var(--toast-backgroundColor);
					--card-borderColor: var(--toast-borderColor);
					--card-paddingY: 0.75em;
					--card-paddingX: 1em;

					width: min(35ch, 100%);
					row-gap: 0.25em;

					transition: 0.3s;

					& > div {
						row-gap: 0.25em;
					}

					& [data-melt-toast-close] {
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
				}
			}
		}
	}
</style>