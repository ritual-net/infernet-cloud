import { error, json } from '@sveltejs/kit';
import { getServiceAccountById } from '$/lib/db/queries';
import { ProviderClient } from '$/lib/index';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Fetch nested provider info (regions, zones, machines) from cloud providers
 * (e.g., GCP, AWS) given a service account.
 *
 * @param locals - The locals object contains the client.
 * @param params - parameters object expected to contain a service account
 *	 `serviceAccountId`.
 * @returns Flat array of ProviderInfo objects.
 */
export const GET: RequestHandler = async ({ locals: { client }, params }) => {
	const serviceAccountId = params.serviceAccountId;
	if (!serviceAccountId) {
		return error(400, `Service account ID is required.`);
	}

	const serviceAccount = await getServiceAccountById(client, serviceAccountId, true);
	if (!serviceAccount) {
		return error(400, `Service account ID ${serviceAccountId} does not exist.`);
	}

	return json(
		await new ProviderClient[serviceAccount.provider]().getProviderInfo(serviceAccount.creds)
	);
};
