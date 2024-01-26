import { getProviderByServiceAccountId, QueryByProvider } from '$lib/db/queries';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { ProviderClient } from '$lib/index';

/**
 * Fetch nested provider info (regions, zones, machines) from cloud providers
 * (e.g., GCP, AWS) given a service account.
 *
 * @param params - parameters object expected to contain a service account
 * `serviceAccountId`.
 * @returns Flat array of ProviderInfo objects.
 */
export const GET: RequestHandler = async ({ params }) => {
	const serviceAccountId = params.serviceAccountId;
	if (!serviceAccountId) {
		return error(400, `Service account ID is required.`);
	}
	const providerType = await getProviderByServiceAccountId(serviceAccountId);
	if (!providerType) {
		return error(400, `Provider type is null for service account ID: ${serviceAccountId}`);
	}
	const serviceAccount =
		await QueryByProvider[providerType].getServiceAccountById(serviceAccountId);
	if (!serviceAccount) {
		return error(400, `Service account ID ${serviceAccountId} does not exist.`);
	}
	const provider = ProviderClient[providerType];
	return json(await provider.getProviderInfo(serviceAccount.creds));
};
