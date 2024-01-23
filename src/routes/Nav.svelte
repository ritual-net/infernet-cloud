<script lang="ts">
	// Context
	import { page } from '$app/stores'

	import { getContext } from 'svelte'

	const isSignedIn = getContext<SvelteStore<boolean>>('isSignedIn')


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
</script>


<nav class="row">
	<a
		href="/"
		aria-current={$page.url.pathname === '/' ? 'page' : undefined}
		class="home row"
	>
		<img
			class="logo"
			src="/ritual.svg"
			alt="Ritual Logo"
		/>

		<h1>
			Infernet Cloud
			<span class="annotation">by Ritual</span>
		</h1>
	</a>

	<ul class="row">
		{#each navItems as item}
			<li>
				<a	
					href={item.href}
					aria-current={$page.url.pathname === item.href ? 'page' : undefined}
				>
					{item.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>


<style>
	:root {
		--nav-link-default-opacity: 0.7;
	}

	a {
		display: inline-flex;

		transition: var(--active-transitionOutDuration) var(--ease-out-expo);

		&:active {
			transition-duration: var(--active-transitionInDuration);
			opacity: var(--active-opacity);
			scale: var(--active-scale);
		}

		&[href="/"] {
			font-size: 1.5em;

			gap: 0.33em;
			font-family: var(--fontFamily-display);

			& img {
				height: 1.25em;
			}
		}
	}

	li {
		list-style-type: none;
	}

	ul a:not([aria-current="page"]) {
		color: hsl(from var(--textColor) h s l / var(--nav-link-default-opacity));
	}
	@supports not (color: hsl(from #000 h s l)) {
		ul a:not([aria-current="page"]) {
			filter: opacity(0.7);
		}
	}
</style>
