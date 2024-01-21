import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { PROVIDER_MAP } from '$structs/cloud';

/**
 * Fetch all zones for given provider (e.g. GCP, AWS) in a region.
 * @param params - parameters object expected to contain a `provider` and `region` property.
 * @returns Array of zone names.
 */
export const GET: RequestHandler = async ({ params }) => {
	const providerId = params.provider;
	const region = params.region;
	if (!providerId || !region) {
		return error(400, 'No providerId and/or region provided');
	}

	if (providerId in PROVIDER_MAP) {
		const provider = PROVIDER_MAP[providerId];
		return json(await provider.getZones(region));
	} else {
		return error(400, `Unknown provider: ${providerId}`);
	}
};
