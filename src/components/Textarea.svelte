<script lang="ts">
	// Inputs
	export let name: string
	export let value: string = ''


	// Events
	export let onblur: (e: Event) => void = () => {}
</script>


<div class="stack">
	<input
		bind:value
		{name}
		{...$$restProps}
		type="text"
	/>

	<textarea
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
