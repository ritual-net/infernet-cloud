import * as z from 'yup'

export const PasswordFormData = z
	.object({
		'reset_token': z
			.string()
			.required(),

		'password': z
			.string()
			.min(10)
			.required(),
	})
