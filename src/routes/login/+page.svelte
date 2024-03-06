<script lang="ts">
	// Constants
	enum FormAction {
		SignUp = '?/signUp',
		SignIn = '?/signIn',
		ResetPassword = '?/resetPassword',
	}


	// Context
	import { page } from '$app/stores'

	import type { PageData } from './$types'

	const {
		signUpFormData,
		signInFormData,
		resetPasswordFormData,
	} = $page.data as PageData


	// Functions
	import { goto } from '$app/navigation'


	// Schema
	import { SignUpFormData, SignInFormData, ResetPasswordFormData } from './schema'


	// Internal state
	import { superForm } from 'sveltekit-superforms/client'
	import { yupClient } from 'sveltekit-superforms/adapters'

	const {
		formId: signUpFormId,
		form: signUpForm,
		errors: signUpErrors,
		enhance: signUpEnhance,
		constraints: signUpConstraints,
		submitting: signUpSubmitting,
	} = superForm(signUpFormData, {
		dataType: 'json',
		customValidity: true,
		validators: yupClient(SignUpFormData),

		onResult: ({ result }) => {
			if(result.type === 'failure')
				alert(result.data?.result?.message)
		},
	})

	const {
		formId: signInFormId,
		form: signInForm,
		errors: signInErrors,
		enhance: signInEnhance,
		constraints: signInConstraints,
		submitting: signInSubmitting,
	} = superForm(signInFormData, {
		dataType: 'json',
		customValidity: true,
		validators: yupClient(SignInFormData),

		onResult: ({ result }) => {
			if(result.type === 'failure')
				alert(result.data?.result?.message)
		},
	})

	const {
		formId: resetPasswordFormId,
		form: resetPasswordForm,
		errors: resetPasswordErrors,
		enhance: resetPasswordEnhance,
		constraints: resetPasswordConstraints,
		submitting: resetPasswordSubmitting,
	} = superForm(resetPasswordFormData, {
		dataType: 'json',
		customValidity: true,
		validators: yupClient(ResetPasswordFormData),

		onResult: ({ result }) => {
			if(result.type === 'failure')
				alert(result.data?.result?.message)
		},
	})

	let currentForm = FormAction.SignUp
	
	let email = ''
	$: $signUpForm.email = $signInForm.email = $resetPasswordForm.email = email


	// Components
	import Tabs from '$/components/Tabs.svelte'
</script>


<div class="container">
	<Tabs
		bind:value={currentForm}
		items={[
			{
				id: FormAction.SignUp,
				label: 'Sign Up',
			},
			{
				id: FormAction.SignIn,
				label: 'Log In',
			},
			{
				id: FormAction.ResetPassword,
				label: 'Reset Password',
			},
		]}
	>
		<svelte:fragment slot="content"
			let:item
		>
			{#if item.id === FormAction.SignUp}
				<form
					method="POST"
					use:signUpEnhance
					action={FormAction.SignUp}
					class="card column"
				>
					<input
						type="hidden"
						name="__superform_id"
						bind:value={$signUpFormId}
					/>

					<div class="column inline">
						<h3>Create account</h3>
						<p>Set up your Infernet Cloud account to get started.</p>
					</div>

					<input
						type="text"
						name="name"
						placeholder="Name"
						bind:value={$signUpForm.name}
						{...$signUpConstraints.name}
					/>

					<input
						type="email"
						name="email"
						placeholder="Email address"
						bind:value={email}
						{...$signUpConstraints.email}
					/>

					<input
						type="password"
						name="password"
						placeholder="Password"
						bind:value={$signUpForm.password}
						{...$signUpConstraints.password}
					/>

					<button
						type="submit"
						class="primary"
						disabled={$signUpSubmitting}
					>Sign Up</button>
				</form>

			{:else if item.id === FormAction.SignIn}
				<form
					method="POST"
					use:signInEnhance
					action={FormAction.SignIn}
					class="card column"
				>
					<input
						type="hidden"
						name="__superform_id"
						bind:value={$signInFormId}
					/>

					<div class="column inline">
						<h3>Log In</h3>
						<p>Log into your Infernet Cloud account to manage your clusters.</p>
					</div>

					<input
						type="email"
						name="email"
						placeholder="Email address"
						bind:value={email}
						{...$signInConstraints.email}
					/>

					<input
						type="password"
						name="password"
						placeholder="Password"
						bind:value={$signInForm.password}
						{...$signInConstraints.password}
					/>

					<button
						type="submit"
						class="primary"
						disabled={$signInSubmitting}
					>Log in</button>
				</form>

			{:else if item.id === FormAction.ResetPassword}
				<form
					method="POST"
					use:resetPasswordEnhance
					action={FormAction.ResetPassword}
					class="card column"
					on:submit={() => {

					}}
				>
					<input
						type="hidden"
						name="__superform_id"
						bind:value={$resetPasswordFormId}
					/>

					<div class="column inline">
						<h3>Reset Password</h3>
						<p>Forgot your password? Confirm your email to reset it.</p>
					</div>

					<input
						type="email"
						name="email"
						placeholder="Email address"
						bind:value={email}
						{...$resetPasswordConstraints.email}
					/>

					<button
						type="submit"
						class="primary"
						disabled={$resetPasswordSubmitting}
					>Send verification link</button>
				</form>
			{/if}
		</svelte:fragment>
	</Tabs>
</div>


<style>
	.container {
		display: grid;
		grid-template-columns: minmax(0, 30rem);
    	justify-content: center;
	}
</style>
