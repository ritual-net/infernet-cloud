import { e } from '$/lib/db';
import type { Client } from 'edgedb'
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
const getServiceAccounts = async (client: Client) => (
	await e
		.select(e.ServiceAccount, () => ({
			id: true,
			name: true,
			provider: true,
		}))
		.run(client)
)

export type QueriedServiceAccount = Awaited<ReturnType<typeof getServiceAccounts>>[number]

export const GET: RequestHandler = async ({ locals: { client } }) => {
	try {
		const serviceAccounts = await getServiceAccounts(client);
		return json(serviceAccounts);
	} catch (err) {
		return error(400, `Error getting service accounts: ${(err as Error).message}`);
	}
};

/**
 * Create a new service account.
 *
 * @param locals - The locals object contains the client.
 * @param request - The request object containing 'name', 'provider' and 'credentials'.
 * @returns Newly created ServiceAccount object.
 */
export const POST: RequestHandler = async ({ locals: { client }, request }) => {
	const { name, provider, credentials } = await request.json();

	if (!name || !provider || !credentials) {
		return error(400, 'name, provider, and credentials are required');
	}

	let query;
	switch (provider) {
		case ProviderTypeEnum.GCP: {
			try {
				await new ProviderClient[ProviderTypeEnum.GCP]().auth(credentials);
			} catch (err) {
				return error(400, `Error validating credentials: ${(err as Error).message}`);
			}
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
			try {
				await new ProviderClient[ProviderTypeEnum.AWS]().auth({
					user_name: credentials.UserName,
					access_key_id: credentials.AccessKeyId,
					status: credentials.Status,
					secret_access_key: credentials.SecretAccessKey,
					create_date: credentials.CreateDates,
				});
			} catch (err) {
				return error(400, `Error validating credentials: ${(err as Error).message}`);
			}
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

	try {
		const newServiceAccount = await query.run(client);
		return json(newServiceAccount);
	} catch (e) {
		return error(400, (e as Error).message);
	}
};
