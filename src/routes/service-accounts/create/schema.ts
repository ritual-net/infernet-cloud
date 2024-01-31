import { z } from 'zod'

export const Provider = z
	.enum([
		'GCP',
		'AWS',
	])
	.default('GCP')

export const GcpCredentials = z
	.object({
		'type': z.
			string()
			.default(''),

		'project_id': z.
			string()
			.default(''),

		'private_key_id': z.
			string()
			.default(''),

		'private_key': z.
			string()
			.default(''),

		'client_email': z.
			string()
			.default(''),

		'client_id': z.
			string()
			.default(''),

		'auth_uri': z.
			string()
			.default(''),

		'token_uri': z.
			string()
			.default(''),

		'auth_provider_x509_cert_url': z.
			string()
			.default(''),

		'client_x509_cert_url': z.
			string()
			.default(''),

		'universe_domain': z.
			string()
			.default(''),
	})

export const AwsCredentials = z
	.object({
		'user_name': z
			.string()
			.default(''),
			
		'access_key_id': z
			.string()
			.default(''),
			
		'status': z
			.string()
			.default(''),
			
		'secret_access_key': z
			.string()
			.default(''),
			
		'create_date': z
			.string()
			.default(''),
	})
	  

export const FormData = z
	.object({
		'name': z
			.string()
			.default(''),

		'provider':
			Provider
			.default('AWS'),

		'credentials':
			GcpCredentials
			.or(AwsCredentials),
	})
