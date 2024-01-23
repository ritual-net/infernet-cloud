import { client, e } from '$lib/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Retrieve a Service Account by its ID.
 *
 * @param params - The parameters object, expected to contain 'serviceAccountId'.
 * @returns Service Account object.
 */
export const GET: RequestHandler = async ({ params }) => {
	const id = params.serviceAccountId;

	if (!id) {
		return error(400, 'Service account id is required');
	}

	// TODO: Make sure sa belongs to user through auth

	const result = await e
		.select(e.ServiceAccount, () => ({
			id: true,
			name: true,
			provider: true,
			filter_single: { id }
		}))
		.run(client);

	return json(result);
};

/**
 * Delete a Service Account by its ID.
 *
 * Only deletes service account if it is not in use by any clusters.
 *
 * @param request - The parameters object, expected to contain 'serviceAccountId'.
 * @returns ID of the deleted service account.
 */
export const DELETE: RequestHandler = async ({ params }) => {
	const id = params.serviceAccountId;

	if (!id) {
		return error(400, 'Service account id is required');
	}

	// TODO: confirm sa belongs to user through auth, before deleting

	// Check if service account is in use by any clusters
	const cluster_count = await e
		.select(e.Cluster, (cluster) => ({
			filter: e.op(cluster.service_account.id, '=', e.uuid(id))
		}))
		.run(client);

	if (cluster_count.length > 0) {
		return error(400, 'Service account is in use by one or more clusters');
	}

	// Delete service account
	const result = await e
		.delete(e.ServiceAccount, () => ({
			filter_single: { id }
		}))
		.run(client);

	return json(result);
};
