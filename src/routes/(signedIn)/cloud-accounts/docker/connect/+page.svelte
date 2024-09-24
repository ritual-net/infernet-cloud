<script lang="ts">
	// Data
	import { FormData } from './schema'


	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	const {
		formData,
	} = $page.data as PageData


	// Actions
	import { type Toast, addToast, removeToast } from '$/components/Toaster.svelte'


	// Internal state
	import { superForm } from 'sveltekit-superforms/client'
	import { yupClient } from 'sveltekit-superforms/adapters'

	const {
		form,
		enhance,
		errors,	
		allErrors,
		constraints,

		capture,
		restore,

		submitting,
		delayed,
	} = superForm(formData, {
		dataType: 'json',
		customValidity: true,
		validators: yupClient(FormData),
	})

	export const snapshot = { capture, restore }


	// Actions
	let delayedToast: Toast
	$: if($delayed){
		delayedToast = addToast({
			closeDelay: 0,
			data: {
				type: 'loading',
				title: `Connecting Docker account...`,
			},
		})
	}else{
		if(delayedToast)
			removeToast(delayedToast.id)
	}

	import { onDestroy } from 'svelte'

	onDestroy(() => {
		if(delayedToast)
			removeToast(delayedToast.id)
	})


	// Components
	import FormSubmitButton from '$/components/FormSubmitButton.svelte'
</script>


<form
	method="POST"
	use:enhance
	class="column"
>
	<header>
		<h2>Connect Docker account</h2>
	</header>

	<section class="card column wrap">
		<div class="column inline">
			<h3>
				Docker credentials
			</h3>

			<p>Connect your Docker Hub account to use private Docker images within your Infernet nodes.</p>
		</div>

		<ol class="column">
			<li>
				<p class="row wrap">
					<span>
						Sign into <a href="https://login.docker.com/u/login" target="_blank">Docker Hub</a>.
					</span>

					<a
						class="button small"
						href="https://login.docker.com/u/login"
						target="_blank"
					>
						Sign in
					</a>
				</p>
			</li>
			
			<li>
				<p class="row wrap">
					<span>
						Create a new "Read-only" <a href="https://hub.docker.com/settings/security" target="_blank">Access Token</a>.
					</span>

					<a
						class="button small"
						href="https://hub.docker.com/settings/security"
						target="_blank"
					>
						Create Access Token
					</a>
				</p>
			</li>

			<li>
				<p>Copy and paste the Access Token below.</p>
			</li>
		</ol>

		<div class="row equal">
			<div class="column">
				<label for="dockerAccount.username">Username</label>

				<input
					type="text"
					id="username"
					name="dockerAccount.username"
					placeholder="mydockerusername"
					bind:value={$form.username}
					{...$constraints.username}
				/>
			</div>

			<div class="column">
				<div class="row wrap">
					<label for="dockerAccount.password">Private access token</label>

					<button
						type="button"
						class="small"
						on:click={async () => {
							$form.password = await navigator.clipboard.readText()
						}}
					>Paste from clipboard</button>
				</div>

				<div class="stack">
					<input
						type="password"
						name="dockerAccount.password"
						placeholder="dckr_pat_..."
						bind:value={$form.password}
						{...$constraints.password}
					/>
				</div>
			</div>
		</div>
	</section>

	<footer class="row">
		<a
			class="button"
			href={`/cloud-accounts`}
		>
			Cancel
		</a>

		<FormSubmitButton
			submitting={$submitting}
			allErrors={$allErrors}
			submitLabel="Connect Docker account"
		/>
	</footer>
</form>
