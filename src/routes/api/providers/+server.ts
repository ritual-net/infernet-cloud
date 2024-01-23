import { e } from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Fetch all compute providers.
 *
 * @returns Array of CloudProvider objects.
 */
export const GET: RequestHandler = async () => {
	// Get all providers
	const providers = e.CloudProvider.__values__.map((provider) => {
		return {
			id: provider
		};
	});
	return json(providers);
};
