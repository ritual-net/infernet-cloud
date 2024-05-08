<script lang="ts">
	// Inputs
	export let name: string
	export let value: string = ''


	// Events
	export let onblur: (e: Event) => void = () => {}


	// Internal state
	let textareaElement: HTMLTextAreaElement
</script>


<div class="stack">
	<input
		bind:value
		{name}
		{...$$restProps}
		on:focus={() => textareaElement?.focus()}
		type="text"
	/>

	<textarea
		bind:this={textareaElement}
		bind:value
		{...$$restProps}
		on:blur={onblur}
	/>
</div>


<style>
	.stack {
		width: 100%;
	}

	input {
		opacity: 0;
		pointer-events: none;
		height: 100%;
	}
</style>
