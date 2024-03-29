<script lang="ts">
	// Context
	import { getContext } from 'svelte'

	const isSignedIn = getContext<SvelteStore<boolean>>('isSignedIn')
</script>


{#if !$isSignedIn}
	<form
		on:submit={() => $isSignedIn = true}
	>
		<button>Log in</button>
	</form>
{:else}
	<form
		on:submit={() => $isSignedIn = false}
	>
		<button>Sign out</button>
	</form>
{/if}
