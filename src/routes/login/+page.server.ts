import { SignUpFormData, SignInFormData, ResetPasswordFormData } from './schema'
import { superValidate } from 'sveltekit-superforms/server'

import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({
	locals,
}) => {
	const signUpFormData = await superValidate(SignUpFormData)
	const signInFormData = await superValidate(SignInFormData)
	const resetPasswordFormData = await superValidate(ResetPasswordFormData)

	return {
		signUpFormData,
		signInFormData,
		resetPasswordFormData,
		isSignedIn: locals.isSignedIn,
	}
}


// Actions
import { type Actions, fail } from '@sveltejs/kit'

export const actions: Actions = {
	signUp: async ({
		request,
		fetch,
	}) => {
		const signUpFormData = await superValidate(request, SignUpFormData)

		if (!signUpFormData.valid) {
			return fail(400, { signUpFormData })
		}

		const result = await fetch('/auth/signup', {
			method: 'POST',
			body: JSON.stringify(signUpFormData.data),
		})
			.then(response => response.json())

		return {
			signUpFormData,
			result,
		}
	},

	signIn: async ({
		request,
		fetch,
	}) => {
		const signInFormData = await superValidate(request, SignInFormData)

		if (!signInFormData.valid) {
			return fail(400, { signInFormData })
		}

		const result = await fetch('/auth/signin', {
			method: 'POST',
			body: JSON.stringify(signInFormData.data),
		})
			.then(response => response.json())

		return {
			signInFormData,
			result,
		}
	},


	resetPassword: async ({
		request,
		fetch,
	}) => {
		const resetPasswordFormData = await superValidate(request, ResetPasswordFormData)

		if (!resetPasswordFormData.valid) {
			return fail(400, { resetPasswordFormData })
		}

		const result = await fetch('/auth/send-reset-password-email', {
			method: 'POST',
			body: JSON.stringify(resetPasswordFormData.data),
		})
			.then(response => response.json())

		return {
			resetPasswordFormData,
			result,
		}
	},
}
