<script lang="ts">
	// Global Styles
	import '../fonts.css'
	import '../global.css'


	// Context
	import { navigating, page } from '$app/stores'
	import { browser } from '$app/environment'

	import { getFlash } from 'sveltekit-flash-message'
 	const flash = getFlash(page)


	// Global state
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
			},
		},
	})


	// Actions
	import { addToast, removeToast, type Toast } from '$/components/Toaster.svelte'

	$: if($page.form?.form?.message){
		const {
			title,
			description,
		} = $page.form.form.message as {
			title?: string,
			description?: string,
		}

		addToast({
			data: {
				type: $page.status < 400 ? 'success' : 'error',
				title: title ?? ($page.status < 400 ? 'Success' : 'Error'),
				description,
			},
		})
	}

	$: if(browser && $flash){
		addToast({
			data: {
				type: $flash.type,
				title: $flash.message.title ?? ($flash.type === 'success' ? 'Success' : 'Error'),
				description: $flash.message.description,
			},
		})
	}

	let navigatingToast: Toast | undefined

	$: if($navigating){
		setTimeout(() => {
			if($navigating){
				navigatingToast ||= addToast({
					data: {
						type: 'default',
						title: 'Loading...',
					},
				})
			}
		}, 1000)
	}else{
		if(navigatingToast){
			removeToast(navigatingToast.id)
			navigatingToast = undefined
		}
	}


	// Components
	import Toaster from '$/components/Toaster.svelte'

	import RitualLogo from '$/icons/RitualLogo.svelte'
	import InfernetCloudLogo from '$/icons/InfernetCloudLogo.svelte'

	import Nav from './Nav.svelte'
	import WithIcon from '$/components/WithIcon.svelte'
</script>


<QueryClientProvider client={queryClient}>
	<header>
		<Nav />
	</header>

	<div class="main-wrapper">
		<slot />
	</div>

	<footer>
		<nav class="row wrap">
			<div class="row wrap">
				<a
					class="logo row wrap"
					href="https://ritual.net"
					target="_blank"
				>
					<RitualLogo />
					<b>Ritual</b>
				</a>

				<ul class="row">
					<li class="row">
						<a
							href="https://docs.ritual.net/infernet/about"
							target="_blank"
						>
							Infernet Docs
						</a>
					</li>
				</ul>
			</div>

			<span class="annotation">
				<a
					href="https://github.com/ritual-net/infernet-cloud"
					target="_blank"
				>
					<WithIcon>
						<svelte:fragment slot="icon">
							<InfernetCloudLogo />
						</svelte:fragment>

						Infernet Cloud v1.0.0
					</WithIcon>
				</a>
			</span>
		</nav>
	</footer>

	<Toaster />
</QueryClientProvider>


<style>
	:global(body) {
		min-height: 100vh;
		min-height: 100dvh;
	/* } */

	/* :global(body > div) { */
		min-height: 100vh;
		min-height: 100dvh;

		display: grid !important;
		grid:
			'header' 4rem
			'main' 1fr
			'footer' auto
			/ minmax(0, 1fr);
		;

		/* & > div { */
			/* isolation: isolate; */
		/* } */
	}

	header,
	:global(main),
	footer {
		display: grid;
		grid-template-columns: minmax(0, 50rem);
		justify-content: center;

		padding: 1rem;
	}

	header {
		grid-area: header;
		z-index: 1;

		position: sticky;
		top: 0;

		backdrop-filter: var(--backdropFilter);

		@media (width <= 50rem) {
			isolation: isolate;
			display: grid !important;
			overflow: hidden;

			backdrop-filter: blur(8px);
			background-color: rgba(255, 255, 255, 0.85);

			transition-property: height;
			transition-duration: 0.3s;

			&:is(:hover, :focus-within) {
				height: max-content;

				~ .main-wrapper {
					filter: blur(8px);
					pointer-events: none;
				}
			}
		}
	}

	.main-wrapper {
		grid-area: 1 / 1 / -1 / -1;

		display: grid;
		grid-template-rows: subgrid;
		grid-template-columns: subgrid;

		transition-property: filter;
		transition-duration: 0.3s;
	}

	:global(main) {
		grid-area: main;
		align-content: start;

		gap: 2rem 1rem;
		padding-block-end: 10rem;
	}

	footer {
		grid-area: footer;

		.logo {
			--accentColor: var(--color-ritualGreen-dark);

			font-size: 1.1em;
			line-height: 1;

			gap: 0.5em;

			letter-spacing: 0.09em;
			text-transform: uppercase;

			:global(svg) {
				width: 1.737em;
			}
		}

		ul {
			font-size: 0.8em;
			padding: 0;
		}
	}
</style>
