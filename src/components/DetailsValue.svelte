<script lang="ts">
	// Inputs
	export let value: Record<string, any>


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
	<dl class="card column">
		{#each Object.entries(value) as [key, subvalue] (key)}
			{#if (
				Array.isArray(subvalue)
					? !Array.isArray(subvalue[0]) && typeof subvalue[0] === 'object'
					: typeof subvalue === 'object'
			)}
				<Collapsible
					tagName="div"
				>
					<svelte:fragment slot="trigger">
						<header>
							<dt class="row" data-after="▾">
								{key}
							</dt>
						</header>
					</svelte:fragment>

					<section>
						<dd>
							<svelte:self
								value={subvalue}
							/>
						</dd>
					</section>
				</Collapsible>
			{:else}
				<section class="row wrap">
					<dt>{key}</dt>

					<dd>
						<svelte:self
							value={subvalue}
						/>
					</dd>
				</section>
			{/if}
		{/each}
	</dl>
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
</style>
