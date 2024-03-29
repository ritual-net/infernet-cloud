import * as z from 'yup'

export const SignUpFormData = z
	.object({
		'name': z
			.string()
			.required(),

		'email': z
			.string()
			.email()
			.required(),

		'password': z
			.string()
			.min(16)
			.required(),

		'provider': z
			.string()
			.default('builtin::local_emailpassword')
			.required(),
	})


export const SignInFormData = z
	.object({
		'email': z
			.string()
			.email()
			.required(),

		'password': z
			.string()
			.min(16)
			.required(),

		'provider': z
			.string()
			.default('builtin::local_emailpassword')
			.required(),
	})


export const ResetPasswordFormData = z
	.object({
		'email': z
			.string()
			.email()
			.required(),
	})
