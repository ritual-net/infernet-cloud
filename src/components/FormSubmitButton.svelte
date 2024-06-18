<script lang="ts">
	// Inputs
	export let submitting: boolean

	export let allErrors: {
		path: string;
		messages: string[];
	}[]

	export let submitLabel: string


	// Components
	import Tooltip from './Tooltip.svelte'
</script>


<Tooltip
	labelText="Form errors"
	isEnabled={allErrors.length > 0}
>
	<button
		type="submit"
		class="primary"
		disabled={submitting || allErrors.length > 0}
	>
		{submitLabel}
	</button>

	<svelte:fragment slot="content">
		{#each allErrors as error}
			<div>
				{error.path}
				<ul>
					{#each error.messages as message}
						<li>{message}</li>
					{/each}
				</ul>
			</div>
		{/each}
	</svelte:fragment>
</Tooltip>
