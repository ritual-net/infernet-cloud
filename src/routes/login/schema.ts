import { z } from 'zod'

export const SignUpFormData = z
	.object({
		'name': z
			.string()
			.default(''),

		'email': z
			.string()
			.email()
			.default(''),

		'password': z
			.string()
			.min(16)
			.default(''),

		'provider': z
			.string()
			.default('builtin::local_emailpassword'),
	})


export const SignInFormData = z
	.object({
		'email': z
			.string()
			.email()
			.default(''),

		'password': z
			.string()
			.min(16)
			.default(''),

		'provider': z
			.string()
			.default('builtin::local_emailpassword'),
	})


export const ResetPasswordFormData = z
	.object({
		'email': z
			.string()
			.email()
			.default(''),
	})
