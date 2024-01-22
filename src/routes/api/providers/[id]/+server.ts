import { client, e } from '$db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { AWSClient } from '$lib/clients/aws';
import { GCPClient } from '$lib/clients/gcp';
import { BaseClient } from '$lib/clients/base';

export const PROVIDER_MAP: Record<string, BaseClient> = {
	aws: new AWSClient(),
	gcp: new GCPClient()
};

/**
 * Fetch nested provider info (regions, zones, machines)
 * from cloud providers (e.g., GCP, AWS) given a service account.
 * @param params - parameters object expected to contain a service account `id`.
 * @returns Flat array of ProviderInfo objects.
 */
export const GET: RequestHandler = async ({ params }) => {
	if (!params.id) {
		return error(400, `Service account ID is required.`);
	}
	const result = await e
		.select(e.ServiceAccount, (sa) => ({
			id: true,
			credentials: true,
			provider: true,
			filter: e.op(sa.id, '=', params.id)
		}))
		.run(client);

	const serviceAccount = result[0];

	if (!serviceAccount) {
		return error(400, `Service account not found for ID: ${params.id}`);
	}

	const providerId = serviceAccount.provider;
	if (!(providerId in PROVIDER_MAP)) {
		return error(400, `Provider ${providerId} not supported.`);
	}

	const provider = PROVIDER_MAP[providerId];
	return json(await provider.getProviderInfo(serviceAccount.credentials));
};
