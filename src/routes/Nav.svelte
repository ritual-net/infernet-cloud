<script lang="ts">
	// Context
	import { page } from '$app/stores'


	// Internal state
	let navItems: {
		href: string,
		label: string,
		type?: 'link' | 'button',
	}[]

	$: navItems = [
		{
			href: '/cloud-accounts',
			label: 'Accounts',
		},
		{
			href: '/templates',
			label: 'Templates',
		},
		{
			href: '/clusters',
			label: 'Clusters',
		},
		$page.data.user ? {
			href: '/account',
			label: $page.data.user.name || $page.data.user.email,
			type: 'button',
		} : {
			href: '/login',
			label: 'Log In',
			type: 'button',
		},
	]


	// Components
	import RitualLogo from '$/icons/RitualLogo.svelte'
</script>


<nav class="row">
	<a
		href="/"
		aria-current={$page.url.pathname === '/' ? 'page' : undefined}
		class="home row"
	>
		<RitualLogo />

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
					class:button={item.type === 'button'}
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

		transition: var(--active-transitionOutDuration) var(--transition-easeOutExpo);

		&:active {
			transition-duration: var(--active-transitionInDuration);
			opacity: var(--active-opacity);
			scale: var(--active-scale);
		}

		&[href="/"] {
			font-size: 1.5em;

			gap: 0.33em;
			font-family: var(--fontFamily-display);

			& :global(svg) {
				flex-shrink: 0;
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

	@media (width <= 45rem) {
		nav {
			display: grid !important;
			justify-content: stretch;
			justify-items: start;
		}

		li {
			display: grid !important;
		}
	}
</style>
