<script lang="ts">
	// Types
	import type { PageData } from './$types'


	// Internal state
	import { page } from '$app/stores'
	import { superForm } from 'sveltekit-superforms/client'

	const { form, enhance, errors, constraints } = superForm(($page.data as PageData).form, {
		dataType: 'json',
	})


	// Context
	import { getContext } from 'svelte'

	const isSignedIn = getContext<SvelteStore<boolean>>('isSignedIn')
</script>


{#if !$isSignedIn}
	<form
		class="card column"
		on:submit={() => $isSignedIn = true}
	>
		<h3>Create account</h3>
		<p>Set up your Infernet Cloud account to get started.</p>

		<input
			type="email"
			name="email"
			placeholder="Enter email address"
			bind:value={$form.email}
			{...$constraints.email}
		/>

		<button>Log in</button>
	</form>
{:else}
	<form
		class="card"
		on:submit={() => $isSignedIn = false}
	>
		<button>Sign out</button>
	</form>
{/if}
