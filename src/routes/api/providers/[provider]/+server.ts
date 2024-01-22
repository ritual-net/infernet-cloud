import { client, e } from '$db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { PROVIDER_MAP } from '$structs/cloud';
import type { Machine } from '$structs/cloud';

type ProviderInfo = {
	region: string;
	zones: string[];
	machines: Machine[];
};

/**
 * Fetch nested provider info (regions, zones, machines)
 * for a given cloud provider (e.g., GCP, AWS).
 * @param params - parameters object expected to contain a `provider`.
 * @returns Flat array of ProviderInfo objects.
 */
export const GET: RequestHandler = async ({ params }) => {
	const providerId = params.provider;
	if (!providerId || !(providerId in PROVIDER_MAP)) {
		return error(400, 'No/unknown providerId given.');
	}
	const result = await e
		.select(e.ServiceAccount, (sa) => ({
			id: true,
			credentials: true,
			provider: true,
			filter: e.op(sa.provider, '=', providerId)
		}))
		.run(client);

	const credentials = result[0]?.credentials;

	if (!credentials) {
		return error(400, `Credentials not found for provider: ${providerId}`);
	}

	const provider = PROVIDER_MAP[providerId];
	await provider.auth(credentials);
	const regions = await provider.getRegions();
	const providerInfo = await Promise.all(
		regions.map(async (region) => {
			const zones = await provider.getZones(region);
			const machines = await provider.getMachines(region);

			return {
				region: region,
				zones: zones,
				machines: machines
			} as ProviderInfo;
		})
	);

	return json(providerInfo);
};
