<script lang="ts">
	// Context
	import { page } from '$app/stores'

	import type { PageData } from './$types'

	const {
		formData,
	} = $page.data as PageData


	// Schema
	import { PasswordFormData } from './schema'


	// Internal state
	import { superForm } from 'sveltekit-superforms/client'
	import { yupClient } from 'sveltekit-superforms/adapters'

	const {
		form,
		enhance,
		constraints,
		allErrors,

		submitting,
	} = superForm(formData, {
		dataType: 'json',
		customValidity: true,
		validators: yupClient(PasswordFormData),
	})


	// Components
	import FormSubmitButton from '$/components/FormSubmitButton.svelte'
</script>


<svelte:head>
	<title>Reset Password | Infernet Cloud</title>
</svelte:head>


<div class="container">
	<form
		method="POST"
		use:enhance
		class="card column"
	>
		<div class="column inline">
			<h3>Reset Password</h3>
			<p>Set your new password.</p> 
		</div>

		<input
			type="password"
			name="password"
			placeholder="Password"
			autocomplete="new-password"
			bind:value={$form.password}
			{...$constraints.password}
		/>

		<FormSubmitButton
			allErrors={$allErrors}
			submitting={$submitting}
			submitLabel="Set password"
		/>
	</form>
</div>


<style>
	.container {
		display: grid;
		grid-template-columns: minmax(0, 30rem);
    	justify-content: center;
	}
</style>
