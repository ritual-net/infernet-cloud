// Schema
import { superValidate, message } from 'sveltekit-superforms/server'
import { yup } from 'sveltekit-superforms/adapters'
import { PasswordFormData } from './schema'


// Data
import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({
	url,
	cookies,
}) => {
	const reset_token = url.searchParams.get('reset_token')

	if (!reset_token)
		return flashRedirect(
			400,
			`/login`,
			{
				type: 'error',
				message: {
					title: `The password reset link isn't valid.`,
				},
			},
			cookies,
		)

	const formData = await superValidate(
		{
			reset_token,
			password: '',
		},
		yup(PasswordFormData),
	)

	return {
		formData,
	}
}


// Actions
import { type Actions, fail } from '@sveltejs/kit'
import { redirect as flashRedirect } from 'sveltekit-flash-message/server'

export const actions: Actions = {
	default: async ({
		request,
		fetch,
		cookies,
	}) => {
		const formData = await superValidate(request, yup(PasswordFormData))

		if (!formData.valid) {
			return fail(400, { formData })
		}

		const response = await fetch('/auth/reset-password', {
			method: 'POST',
			body: JSON.stringify(formData.data),
		})

		if (!response.ok) {
			const result = await response.json()

			return message(
				formData,
				{
					title: `Couldn't reset password.`,
					description: result.message,
				},
				{
					status: response.status,
				},
			)
		}

		// const newUser = response.json()

		return flashRedirect(
			303,
			`/login`,
			{
				type: 'success',
				message: {
					title: `Password reset successfully.`,
					description: `You can now log in with your new password.`,
				},
			},
			cookies,
		)
	},
}
