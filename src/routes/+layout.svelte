<script lang="ts">
	// Global Styles
	import '../fonts.css'
	import '../global.css'


	// Context
	import { page } from '$app/stores'


	// Actions
	import { addToast } from '$/components/Toaster.svelte'

	$: if($page.form?.form?.message){
		const {
			title = 'Success',
			description,
		} = $page.form.form.message as {
			title?: string,
			description?: string,
		}

		addToast({
			data: {
				type: $page.status < 400 ? 'success' : 'error',
				title,
				description,
			},
		})
	}


	// Components
	import Nav from './Nav.svelte'
	import Toaster from '$/components/Toaster.svelte'
</script>


<header>
	<Nav />
</header>

<div class="main-wrapper">
	<main>
		<slot />
	</main>
</div>

<!-- <footer></footer> -->

<Toaster />


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
			'header' auto
			'main' 1fr
			'footer' auto
			/ minmax(0, 1fr);
		;

		/* & > div { */
			/* isolation: isolate; */
		/* } */
	}

	header, main, footer {
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
	}

	.main-wrapper {
		grid-area: 1 / 1 / -1 / -1;

		display: grid;
		grid-template-rows: subgrid;
		grid-template-columns: subgrid;
	}

	main {
		grid-area: main;
		align-content: start;

		gap: 2rem 1rem;
	}

	footer {
		grid-area: footer;
		z-index: 1;

		position: sticky;
		bottom: 0;

		backdrop-filter: var(--backdropFilter);
	}
</style>
