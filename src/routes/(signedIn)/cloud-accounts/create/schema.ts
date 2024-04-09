import * as z from 'yup'

export const Provider = z
	.string()
	.oneOf([
		'GCP',
		'AWS',
	] as const)
	.default('GCP')

export const GcpCredentials = z
	.object({
		'type': z
			.string()
			.default('')
			.required(),

		'project_id': z
			.string()
			.default('')
			.required(),

		'private_key_id': z
			.string()
			.default('')
			.required(),

		'private_key': z
			.string()
			.default('')
			.required(),

		'client_email': z
			.string()
			.default('')
			.required(),

		'client_id': z
			.string()
			.default('')
			.required(),

		'auth_uri': z
			.string()
			.default('')
			.required(),

		'token_uri': z
			.string()
			.default('')
			.required(),

		'auth_provider_x509_cert_url': z
			.string()
			.default('')
			.required(),

		'client_x509_cert_url': z
			.string()
			.default('')
			.required(),

		'universe_domain': z
			.string()
			.default('')
			.required(),
	})

export const AwsCredentials = z
	.object({
		'AccessKey': z
			.object({
				'UserName': z
					.string()
					.default('')
					.required(),

				'AccessKeyId': z
					.string()
					.default('')
					.required(),

				'Status': z
					.string()
					.default('')
					.required(),

				'SecretAccessKey': z
					.string()
					.default('')
					.required(),

				'CreateDate': z
					.string()
					.default('')
					.required(),
			})
			.required(),
	})

export const FormData = z
	.object({
		'name': z
			.string()
			.required(),

		'provider':
			Provider
			.default('AWS')
			.required(),

		'credentials': z
			.mixed()
			.when(
				'provider',
				([provider], schema) => (({
					'AWS': AwsCredentials,
					'GCP': GcpCredentials,
				} as const)[provider as z.InferType<typeof Provider>]),
			)
			.required(),
	})
