// Schema
import { superValidate } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
import { SignUpFormData, SignInFormData, ResetPasswordFormData } from './schema'


// Data
import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({
	locals,
}) => {
	const signUpFormData = await superValidate(zod(SignUpFormData))
	const signInFormData = await superValidate(zod(SignInFormData))
	const resetPasswordFormData = await superValidate(zod(ResetPasswordFormData))

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
		const signUpFormData = await superValidate(request, zod(SignUpFormData))

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
		const signInFormData = await superValidate(request, zod(SignInFormData))

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
		const resetPasswordFormData = await superValidate(request, zod(ResetPasswordFormData))

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
