<script lang="ts">
	// Context
	import { page } from '$app/stores'


	// Internal state
	let navItems: {
		href: string,
		label: string,
		type?: 'link' | 'button',
	}[][]

	$: navItems = [
		!$page.data.user
			? [
				{
					href: '/login',
					label: 'Log In',
					type: 'button',
				},
			]
			: [
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
				{
					href: '/account',
					label: $page.data.user.name || $page.data.user.email,
					type: 'button',
				}
			],
	]


	// Components
	import InfernetCloudLogo from '$/icons/InfernetCloudLogo.svelte'
</script>


<nav class="row">
	<a
		href="/"
		aria-current={$page.url.pathname === '/' ? 'page' : undefined}
		class="home row"
	>
		<h1 class="logotype">
			<InfernetCloudLogo />

			<span>
				<span>Infernet</span>
				<span>Cloud</span>
			</span>
		</h1>
	</a>

	<div class="row wrap">
		{#each navItems as items}
			<ul class="row wrap">
				{#each items as item}
					<li>
						<a	
							href={item.href}
							aria-current={$page.url.pathname.startsWith(item.href) ? 'page' : undefined}
							class:button={item.type === 'button'}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		{/each}
	</div>
</nav>


<style>
	:root {
		--nav-link-default-opacity: 66%;
	}

	.logotype {
		display: flex;
		align-items: center;

		font-size: 1.33em;
		line-height: 1;

		gap: 0.33em;
		font-family: var(--fontFamily-display);

		> :global(svg) {
			height: 1.75em;
		}

		> span {
			display: inline-grid;
			gap: 0.25em;

			> :first-child {
				font-weight: 400;
			}

			> :last-child {
				font-size: 0.5em;
				font-weight: 400;
				text-transform: uppercase;
				letter-spacing: 0.06em;
				opacity: 0.66;
			}
		}
	}

	a {
		display: inline-flex;

		transition-property: background-color, color, opacity, scale;
		transition-duration: var(--active-transitionOutDuration);
		transition-timing-function: var(--transition-easeOutExpo);

		&.home:hover:not(:active) {
			scale: 1.033;
		}

		&:active {
			transition-duration: var(--active-transitionInDuration);
			opacity: var(--active-opacity);
			scale: var(--active-scale);
		}
	}

	ul {
		padding: 0;

		li {
			list-style-type: none;

			a:not([aria-current="page"]) {
				color: hsl(from var(--textColor) h s l / var(--nav-link-default-opacity));
				color: color-mix(in oklch, var(--textColor) var(--nav-link-default-opacity), transparent);

				@supports not (
					(color: hsl(from #000 h s l))
					or (color: color-mix(in oklch, #000, transparent))
				) {
					filter: var(--nav-link-default-opacity);
				}
			}
		}
	}

	@media (width <= 50rem) {
		nav {
			display: grid;
			justify-content: stretch;
			gap: 1.5rem;

			> :last-child {
				display: block;
			}

			li {
				display: grid;

				a:not(.button) {
					padding: 0.25em;
				}
			}

			&:after {
				position: absolute;
				right: 1rem;
				top: 0.6rem;

				font-size: 1.5rem;
				content: '☰';

				:global(header:is(:hover, :focus-within) &) { 
					opacity: 0;
				}
			}

			ul {
				flex-direction: column;
			}
		}
	}
</style>
