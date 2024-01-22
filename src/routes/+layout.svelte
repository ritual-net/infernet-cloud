<script lang="ts">
	// Context
	import { page } from '$app/stores'

	import { setContext } from 'svelte'
	import { writable } from 'svelte/store'

	const isSignedIn = writable(false)
	setContext('isSignedIn', isSignedIn)


	// Internal state

	let navItems: {
		href: string,
		label: string,
	}[]
	$: navItems = [
		{
			href: '/clusters',
			label: 'Clusters',
		},
		{
			href: '/nodes',
			label: 'Nodes',
		},
		$isSignedIn ? {
			href: '/login',
			label: 'Sign out',
		} : {
			href: '/login',
			label: 'Login',
		},
	]

	
	// Global Styles
	import '../fonts.css'
	import '../global.css'
</script>


<header>
	<nav class="row">
		<a
			href="/"
			data-active={$page.url.pathname === '/'}
			class="home row"
		>
			<img
				class="logo"
				src="/ritual.svg"
				alt="Ritual Logo"
			/>

			<h1>Ritual</h1>
		</a>

		<ul class="row">
			{#each navItems as item}
				<li>
					<a	
						href={item.href}
						data-active={$page.url.pathname === item.href}
					>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
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

		display: grid;
		grid:
			'header' auto
			'main' 1fr
			'footer' auto
			/ minmax(0, 1fr);
		;
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

		backdrop-filter: blur(6px);
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

		backdrop-filter: blur(6px);
	}

	[href="/"] {
		font-size: 1.5em;

		gap: 0.33em;
		font-family: var(--fontFamily-display);

		& img {
			height: 1.25em;
		}
	}

	li {
		list-style-type: none;
	}

	ul a[data-active="false"] {
		opacity: 0.7;
	}
</style>
