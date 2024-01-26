import { client, e } from '$lib/db';
import { ProviderTypeEnum } from '$types/provider';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Retrieve all service accounts for a user.
 *
 * @param request - The request object containing 'user'.
 * @returns Array of ServiceAccount objects.
 */
export const GET: RequestHandler = async ({ request }) => {
	const url = new URL(request.url);
	const user = url.searchParams.get('user');

	if (!user) {
		return error(400, 'User id is required');
	}
	// TODO: Get user through auth

	const result = await e
		.select(e.ServiceAccount, (sa) => ({
			id: true,
			name: true,
			provider: true,
			filter: e.op(sa.user.id, '=', e.uuid(user)),
		}))
		.run(client);

	return json(result);
};

/**
 * Create a new service account.
 *
 * @param request - The request object containing 'name', 'provider' and 'credentials'.
 * @returns Newly created ServiceAccount object.
 */
export const POST: RequestHandler = async ({ request }) => {
	// TODO: get user through auth, not through body
	const { user, name, provider, credentials } = await request.json();

	if (!user || !name || !provider || !credentials) {
		return error(400, 'name, provider, and credentials are required');
	}

	// TODO: Validate format of credentials
	// TODO: Validate if credentials work or not, don't store them in db otherwise

	let query;
	switch (provider) {
		case ProviderTypeEnum.GCP: {
			query = e.insert(e.GCPServiceAccount, {
				user: e.select(e.User, () => ({
					filter_single: { id: user },
				})),
				name,
				creds: e.tuple({
					type: e.str(credentials.type),
					project_id: e.str(credentials.project_id),
					private_key_id: e.str(credentials.private_key_id),
					private_key: e.str(credentials.private_key),
					client_email: e.str(credentials.client_email),
					client_id: e.str(credentials.client_id),
					auth_uri: e.str(credentials.auth_uri),
					token_uri: e.str(credentials.token_uri),
					auth_provider_x509_cert_url: e.str(credentials.auth_provider_x509_cert_url),
					client_x509_cert_url: e.str(credentials.client_x509_cert_url),
					universe_domain: e.str(credentials.universe_domain),
				}),
			});
			break;
		}
		case ProviderTypeEnum.AWS: {
			query = e.insert(e.AWSServiceAccount, {
				user: e.select(e.User, () => ({
					filter_single: { id: user },
				})),
				name,
				creds: e.tuple({
					// RHS casing to match AWS API
					user_name: e.str(credentials.UserName),
					access_key_id: e.str(credentials.AccessKeyId),
					status: e.str(credentials.Status),
					secret_access_key: e.str(credentials.SecretAccessKey),
					create_date: e.str(credentials.CreateDate),
				}),
			});
			break;
		}
		default:
			return error(400, 'Provider not supported.');
	}

	const newServiceAccount = await query.run(client);
	return json(newServiceAccount);
};
