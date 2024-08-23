<script lang="ts">
	// Inputs
	export let value: Record<string, any>


	// Internal state
	// (Recursive)
	export let level = 0


	// Components
	import Collapsible from './Collapsible.svelte'
</script>


{#if Array.isArray(value) && value.length}
	{#each value as subvalue}
		<div>
			<svelte:self
				value={subvalue}
			/>
		</div>
	{/each}
{:else if typeof value === 'object'}
	{#if Object.keys(value).length}
		<dl class="card column" data-level={level}>
			{#each Object.entries(value) as [key, subvalue] (key)}
				{#if (
					Array.isArray(subvalue)
						? !Array.isArray(subvalue[0]) && typeof subvalue[0] === 'object'
						: typeof subvalue === 'object'
				)}
					<Collapsible
						tagName="div"
					>
						<svelte:fragment slot="trigger"
							let:open
						>
							<header
								class="row"
								data-after={open ? '▴' : '▾'}
							>
								<dt>
									{key}
								</dt>
							</header>
						</svelte:fragment>

						<dd>
							<svelte:self
								value={subvalue}
								level={level + 1}
							/>
						</dd>
					</Collapsible>
				{:else}
					<section class="row wrap">
						<dt>{key}</dt>

						<dd>
							<svelte:self
								value={subvalue}
								level={level + 1}
							/>
						</dd>
					</section>
				{/if}
			{/each}
		</dl>
	{:else}
		<span data-empty></span>
	{/if}
{:else if value}
	<output><code>{value}</code></output>
{:else}
	<span data-empty></span>
{/if}


<style>
	[data-empty]:before {
		content: '–';
		opacity: 0.5;
	}

	.card {
		--card-level: 0;

		&[data-level="1"] {
			--card-level: 1;
		}

		&[data-level="2"] {
			--card-level: 2;
		}

		&[data-level="3"] {
			--card-level: 3;
		}

		&[data-level="4"] {
			--card-level: 4;
		}

		&[data-level="5"] {
			--card-level: 5;
		}

		&[data-level="6"] {
			--card-level: 6;
		}

		:is(header, section, footer) {
			padding-left: calc(var(--card-paddingX) * (var(--card-level) + 1));
		}
	}

	output {
		display: block;
		overflow: auto;
		max-height: 15em;
		max-height: 10lh;
	}
</style>
