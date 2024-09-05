<script lang="ts">
	// Constants
	enum FormAction {
		SignUp = '?/signUp',
		LogIn = '?/logIn',
		ResetPassword = '?/resetPassword',
	}


	// Context
	import { page } from '$app/stores'

	import type { PageData } from '../../login/$types'

	const {
		signUpFormData,
		signInFormData,
		resetPasswordFormData,
	} = $page.data as PageData


	// Schema
	import { SignUpFormData, SignInFormData, ResetPasswordFormData } from './schema'


	// Internal state
	import { superForm } from 'sveltekit-superforms/client'
	import { yupClient } from 'sveltekit-superforms/adapters'

	const {
		formId: signUpFormId,
		form: signUpForm,
		errors: signUpErrors,
		allErrors: signUpAllErrors,
		enhance: signUpEnhance,
		constraints: signUpConstraints,
		submitting: signUpSubmitting,
	} = superForm(signUpFormData, {
		dataType: 'json',
		customValidity: true,
		validators: yupClient(SignUpFormData),

		invalidateAll: false,

		onResult: ({ result }) => {
			if(result.type === 'success')
				currentForm = FormAction.LogIn
		},
	})

	const {
		formId: signInFormId,
		form: signInForm,
		errors: signInErrors,
		allErrors: signInAllErrors,
		enhance: signInEnhance,
		constraints: signInConstraints,
		submitting: signInSubmitting,
	} = superForm(signInFormData, {
		dataType: 'json',
		customValidity: true,
		validators: yupClient(SignInFormData),
	})

	const {
		formId: resetPasswordFormId,
		form: resetPasswordForm,
		errors: resetPasswordErrors,
		allErrors: resetPasswordAllErrors,
		enhance: resetPasswordEnhance,
		constraints: resetPasswordConstraints,
		submitting: resetPasswordSubmitting,
	} = superForm(resetPasswordFormData, {
		dataType: 'json',
		customValidity: true,
		validators: yupClient(ResetPasswordFormData),

		invalidateAll: false,

		onResult: ({ result }) => {
			if(result.type === 'success')
				currentForm = FormAction.LogIn
		},
	})

	let currentForm = FormAction.SignUp
	$: currentForm = globalThis.location?.hash.replace(/^#/, '?/')
	
	// let email = ''
	// $: $signUpForm.email = $signInForm.email = $resetPasswordForm.email = email


	// Components
	import FormSubmitButton from '$/components/FormSubmitButton.svelte'
	import Tabs from '$/components/Tabs.svelte'
</script>


<svelte:head>
	<title>Log in | Infernet Cloud</title>
</svelte:head>


<div class="container">
	<Tabs
		bind:value={currentForm}
		items={[
			{
				id: FormAction.SignUp,
				label: 'Sign up',
			},
			{
				id: FormAction.LogIn,
				label: 'Log in',
			},
			{
				id: FormAction.ResetPassword,
				label: 'Reset password',
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
						bind:value={$signUpForm.email}
						{...$signUpConstraints.email}
						on:change={e => { $signInForm.email = $resetPasswordForm.email = e.currentTarget.value }}
					/>

					<input
						type="password"
						name="password"
						placeholder="Password"
						bind:value={$signUpForm.password}
						{...$signUpConstraints.password}
					/>

					<FormSubmitButton
						submitting={$signUpSubmitting}
						allErrors={$signUpAllErrors}
						submitLabel="Sign up"
					/>
				</form>

			{:else if item.id === FormAction.LogIn}
				<form
					method="POST"
					use:signInEnhance
					action={FormAction.LogIn}
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
						bind:value={$signInForm.email}
						{...$signInConstraints.email}
						on:change={e => { $signUpForm.email = $resetPasswordForm.email = e.currentTarget.value }}
					/>

					<input
						type="password"
						name="password"
						placeholder="Password"
						bind:value={$signInForm.password}
						{...$signInConstraints.password}
					/>

					<FormSubmitButton
						submitting={$signInSubmitting}
						allErrors={$signInAllErrors}
						submitLabel="Log in"
					/>
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
						bind:value={$resetPasswordForm.email}
						{...$resetPasswordConstraints.email}
						on:change={e => { $signUpForm.email = $signInForm.email = e.currentTarget.value }}
					/>

					<FormSubmitButton
						submitting={$resetPasswordSubmitting}
						allErrors={$resetPasswordAllErrors}
						submitLabel="Send verification link"
					/>
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

		align-self: center;
	}
</style>
