import * as z from 'yup'

export const FormData = z
	.object({
		'username': z
			.string()
			.required(),

		'password': z
			.string()
			.required(),
	})
