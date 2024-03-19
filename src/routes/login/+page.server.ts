// Schema
import { superValidate, message } from 'sveltekit-superforms/server'
import { yup } from 'sveltekit-superforms/adapters'
import { SignUpFormData, SignInFormData, ResetPasswordFormData } from './schema'


// Data
import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({
	parent,
}) => {
	const { user } = await parent()

	if(user)
		redirect(303, '/')

	const signUpFormData = await superValidate(yup(SignUpFormData))
	const signInFormData = await superValidate(yup(SignInFormData))
	const resetPasswordFormData = await superValidate(yup(ResetPasswordFormData))

	return {
		signUpFormData,
		signInFormData,
		resetPasswordFormData,
	}
}


// Actions
import { type Actions, fail, redirect } from '@sveltejs/kit'

export const actions: Actions = {
	signUp: async ({
		request,
		fetch,
	}) => {
		const signUpFormData = await superValidate(request, yup(SignUpFormData))

		if (!signUpFormData.valid) {
			return fail(400, { signUpFormData })
		}

		const response = await fetch('/auth/signup', {
			method: 'POST',
			body: JSON.stringify(signUpFormData.data),
		})

		if(!response.ok){
			const result = await response.json()

			return message(
				signUpFormData,
				{
					title: `Couldn't sign up.`,
					description: result.message,
				},
				{
					status: response.status,
				},
			)
		}

		// const newUser = response.json()

		return message(
			signUpFormData,
			{
				title: `Welcome, ${signUpFormData.data.name}!`,
				description: `Check your email ${signUpFormData.data.email} for a confirmation link.`
			},
		)
	},

	signIn: async ({
		request,
		fetch,
	}) => {
		const signInFormData = await superValidate(request, yup(SignInFormData))

		if (!signInFormData.valid) {
			return fail(400, { signInFormData })
		}

		const response = await fetch('/auth/signin', {
			method: 'POST',
			body: JSON.stringify(signInFormData.data),
		})

		if(!response.ok){
			const result = await response.json()

			return message(
				signInFormData,
				{
					title: `Couldn't sign in.`,
					description: result.message,
				},
				{
					status: response.status,
				},
			)
		}

		// if(response.status === 204)
		// 	return redirect(301, '/clusters')

		return message(
			signInFormData,
			{
				title: `Signed in as ${signInFormData.data.email}.`,
			},
		)
	},

	resetPassword: async ({
		request,
		fetch,
	}) => {
		const resetPasswordFormData = await superValidate(request, yup(ResetPasswordFormData))

		if (!resetPasswordFormData.valid) {
			return fail(400, { resetPasswordFormData })
		}

		const response = await fetch('/auth/send-password-reset-email', {
			method: 'POST',
			body: JSON.stringify(resetPasswordFormData.data),
		})

		if(!response.ok){
			const result = await response.text()

			return message(
				resetPasswordFormData,
				{
					title: `Couldn't reset password.`,
					description: result,
				},
				{
					status: response.status,
				},
			)
		}

		return message(
			resetPasswordFormData,
			{
				title: `Password reset request sent.`,
				description: `Check your email ${resetPasswordFormData.data.email} for a password reset link.`,
			},
		)
	},
}
