<script lang="ts">
	// Global Styles
	import '../fonts.css'
	import '../global.css'


	// Components
	import Nav from './Nav.svelte'
</script>


<header>
	<Nav />
</header>

<div class="main-wrapper">
	<main>
		<slot />
	</main>
</div>

<footer>

</footer>


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
	}

	footer {
		grid-area: footer;
		z-index: 1;

		position: sticky;
		bottom: 0;

		backdrop-filter: var(--backdropFilter);
	}
</style>
