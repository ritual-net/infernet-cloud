<script lang="ts">
	export let value: Record<string, any>
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
			<div class="row">
				<dt>{key}</dt>
				<dd>
					<svelte:self
						value={subvalue}
					/>
				</dd>
			</div>
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
