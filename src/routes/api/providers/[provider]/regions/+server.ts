import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { PROVIDER_MAP } from '$structs/cloud';

/**
 * Fetch all regions covered by given provider (e.g. GCP, AWS).
 * @param params - parameters object expected to contain a `provider`.
 * @returns Array of region names.
 */
export const GET: RequestHandler = async ({ params }) => {
	const providerId = params.provider;
	if (!providerId) {
		return error(400, 'No providerId provided');
	}

	if (providerId in PROVIDER_MAP) {
		const provider = PROVIDER_MAP[providerId];
		return json(await provider.getRegions());
	} else {
		return error(400, `Unknown provider: ${providerId}`);
	}
};
