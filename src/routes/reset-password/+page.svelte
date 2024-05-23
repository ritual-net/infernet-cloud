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

		submitting,
	} = superForm(formData, {
		dataType: 'json',
		customValidity: true,
		validators: yupClient(PasswordFormData),
	})
</script>


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
			bind:value={$form.password}
			{...$constraints.password}
		/>

		<button
			type="submit"
			class="primary"
			disabled={$submitting}
		>Set Password</button>
	</form>
</div>


<style>
	.container {
		display: grid;
		grid-template-columns: minmax(0, 30rem);
    	justify-content: center;
	}
</style>
