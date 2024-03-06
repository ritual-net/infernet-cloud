// Schema
import { superValidate } from 'sveltekit-superforms/server'
import { yup } from 'sveltekit-superforms/adapters'
import { SignUpFormData, SignInFormData, ResetPasswordFormData } from './schema'


// Data
import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({
	locals: { user },
}) => {
	if(user)
		redirect(303, '/clusters')

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

		if(!response.ok)
			return fail(response.status, {
				signUpFormData,
				result: await response.json(),
			})

		if(response.status === 204)
			return redirect(301, '/service-accounts')

		return {
			signUpFormData,
		}
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

		if(!response.ok)
			return fail(response.status, {
				signInFormData,
				result: await response.json(),
			})

		if(response.status === 204)
			return redirect(301, '/clusters')

		return {
			signInFormData,
		}
	},

	resetPassword: async ({
		request,
		fetch,
	}) => {
		const resetPasswordFormData = await superValidate(request, yup(ResetPasswordFormData))

		if (!resetPasswordFormData.valid) {
			return fail(400, { resetPasswordFormData })
		}

		const response = await fetch('/auth/send-reset-password-email', {
			method: 'POST',
			body: JSON.stringify(resetPasswordFormData.data),
		})

		if(!response.ok){
			const result = await response.text()
			
			try {
				return fail(response.status, {
					resetPasswordFormData,
					result: JSON.parse(result),
				})
			}catch(e){
				return fail(response.status, {
					resetPasswordFormData,
					result: result,
				})
			}
		}

		if(response.status === 204)
			return redirect(301, '/clusters')

		return {
			resetPasswordFormData,
		}
	},
}
