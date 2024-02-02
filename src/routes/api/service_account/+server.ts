import { e } from '$/lib/db';
import { ProviderClient } from '$/lib/index';
import { ProviderTypeEnum } from '$/types/provider';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Retrieve all service accounts for the current user.
 *
 * @param locals - The locals object contains the client.
 * @returns Array of ServiceAccount objects.
 */
export const GET: RequestHandler = async ({ locals }) => {
	const client = locals.client;

	const result = await e
		.select(e.ServiceAccount, () => ({
			id: true,
			name: true,
			provider: true,
		}))
		.run(client);

	return json(result);
};

/**
 * Create a new service account.
 *
 * @param locals - The locals object contains the client.
 * @param request - The request object containing 'name', 'provider' and 'credentials'.
 * @returns Newly created ServiceAccount object.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { name, provider, credentials } = await request.json();

	if (!name || !provider || !credentials) {
		return error(400, 'name, provider, and credentials are required');
	}

	const client = locals.client;

	// TODO: Validate format of credentials
    try {
        await (new ProviderClient[provider as ProviderTypeEnum]).auth(credentials);
    } catch (err) {
        return error(400, `Error validating credentials: ${(err as Error).message}`);
    }

	let query;
	switch (provider) {
		case ProviderTypeEnum.GCP: {
			query = e.insert(e.GCPServiceAccount, {
				user: e.global.current_user,
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
				user: e.global.current_user,
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
