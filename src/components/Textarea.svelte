<script lang="ts">
	// Inputs
	export let name: string
	export let value: string = ''
	export let getDisplayValue: ((value: string) => string) | undefined


	// Events
	export let onfocus: (_: FocusEvent & { currentTarget: EventTarget & HTMLTextAreaElement }) => void
	export let onblur: (_: FocusEvent & { currentTarget: EventTarget & HTMLTextAreaElement }) => void


	// Internal state
	let textareaElement: HTMLTextAreaElement
	let isFocused = false
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
		value={!isFocused && getDisplayValue ? getDisplayValue(value) : value}
		on:input={e => { value = e.currentTarget.value }}
		{...$$restProps}
		on:focus={e => {
			isFocused = true
			onfocus?.(e)
		}}
		on:blur={e => {
			isFocused = false
			onblur?.(e)
		}}
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
