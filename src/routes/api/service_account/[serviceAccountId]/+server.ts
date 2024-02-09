import { e } from '$/lib/db';
import { getServiceAccountById } from '$/lib/db/queries';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Retrieve a Service Account by its ID.
 *
 * @param locals - The locals object contains the client.
 * @param params - The parameters object, expected to contain 'serviceAccountId'.
 * @returns Service Account object.
 */
export const GET: RequestHandler = async ({ locals: { client }, params }) => {
	const id = params.serviceAccountId;

	if (!id) {
		return error(400, 'Service account id is required');
	}

	const result = await getServiceAccountById(client, id, false);
	return json(result);
};

/**
 * Delete a Service Account by its ID.
 *
 * Only deletes service account if it is not in use by any clusters.
 *
 * @param locals - The locals object contains the client.
 * @param request - The parameters object, expected to contain 'serviceAccountId'.
 * @returns ID of the deleted service account.
 */
export const DELETE: RequestHandler = async ({ locals: { client }, params }) => {
	const id = params.serviceAccountId;

	if (!id) {
		return error(400, 'Service account id is required');
	}

	// Check if service account is in use by any clusters
	const cluster_count = await e
		.select(e.Cluster, (cluster) => ({
			filter: e.op(cluster.service_account.id, '=', e.uuid(id)),
		}))
		.run(client);

	if (cluster_count.length > 0) {
		return error(400, 'Service account is in use by one or more clusters');
	}

	// Delete service account
	const result = await e
		.delete(e.ServiceAccount, () => ({
			filter_single: { id },
		}))
		.run(client);

	return json(result);
};
