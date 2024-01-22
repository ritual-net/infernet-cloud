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

<main>
	<slot />
</main>

<footer>

</footer>


<style>
	:global(body) {
		width: 50rem;
		max-width: 100%;
		margin: auto;
	}

	header, main, footer {
		padding: 1rem;
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
