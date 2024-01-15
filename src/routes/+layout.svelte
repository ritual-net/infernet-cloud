<script lang="ts">
	// Global Styles
	import '../fonts.css'
	import '../global.css'


	// Context
	import { page } from '$app/stores'
</script>


<header>
	<nav class="row">
		<a
			href="/"
			data-active={$page.url.pathname === '/'}
			class="home row"
		>
			<img src="/ritual.svg" alt="Ritual Logo" />

			<h1>Ritual</h1>
		</a>

		<ul class="row">
			{#each [
				{
					href: '/clusters',
					label: 'Clusters',
				},
				{
					href: '/nodes',
					label: 'Nodes',
				}
			] as {
				href,
				label,
			}}
				<li>
					<a	
						{href}
						data-active={$page.url.pathname === href}
					>
						{label}
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
		gap: 0.5em;
		font-family: var(--fontFamily-display);
	}

	img {
		height: 1.75em;
	}

	li {
		list-style-type: none;
	}

	ul a[data-active="false"] {
		opacity: 0.7;
	}
</style>
