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

	let currentTheme: Theme
	$: if(browser)
		globalThis.document.documentElement.style.colorScheme = currentTheme


	// Components
	import Toaster from '$/components/Toaster.svelte'

	import RitualLogo from '$/icons/RitualLogo.svelte'
	import InfernetCloudLogo from '$/icons/InfernetCloudLogo.svelte'

	import Nav from './Nav.svelte'
	import ThemeSwitch, { type Theme } from './ThemeSwitch.svelte'
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

			<div class="row">
				<label class="theme-switch-label row">
					Theme
					<ThemeSwitch bind:currentTheme />
				</label>

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
			</div>
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
			background-color: light-dark(rgba(255, 255, 255, 0.85), rgba(0, 0, 0, 0.85));

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
		
		/* z-index: 1;
		position: sticky;
		bottom: 0; */

		/* backdrop-filter: var(--backdropFilter); */

		.logo {
			--accentColor: light-dark(var(--color-ritualGreen-dark), var(--color-ritualGreen-light));

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

		.theme-switch-label {
			font-size: 0.8em;
		}
	}
</style>
