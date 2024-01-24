import { error, json } from '@sveltejs/kit';
import { getProviderByClusterId } from '$lib/db/provider';
import { QueryByProvider, client, e } from '$lib/db';
import { ProviderTerraform } from '$lib';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Retrieve a cluster by its ID.
 *
 * @param params - The parameters object, expected to contain 'clusterId'.
 * @returns Cluster object.
 */
export const GET: RequestHandler = async ({ params }) => {
	const id = params.clusterId;

	if (!id) {
		return error(400, 'Cluster id is required');
	}

	// TODO: Make sure cluster belongs to user through auth

	const provider = await getProviderByClusterId(id);
	if (!provider) {
		return error(400, 'Cluster could not be retrieved');
	}

	const cluster = await QueryByProvider[provider].getClusterById(id);
	return json(cluster);
};

// TODO: PATCH

/**
 * Delete a cluster by its ID.
 *
 * @param params - The parameters object, expected to contain 'clusterId'.
 * @returns ID of the deleted cluster.
 */
export const DELETE: RequestHandler = async ({ params }) => {
	const id = params.clusterId;

	if (!id) {
		return error(400, 'Cluster id is required');
	}

	// TODO: confirm cluster belongs to user through auth

	const provider = await getProviderByClusterId(id);
	if (!provider) {
		return error(400, 'Cluster could not be retrieved');
	}

	const cluster = await QueryByProvider[provider].getClusterById(id);
	if (!cluster || !cluster.service_account?.id) {
		return error(404, 'Cluster not found');
	}

	const serviceAccount = await QueryByProvider[provider].getServiceAccountById(
		cluster.service_account.id
	);
	if (!serviceAccount) {
		return error(404, 'Service Account not found');
	}

	const { success, message, state } = await ProviderTerraform[provider].destroy(
		cluster,
		serviceAccount
	);

	if (success) {
		// Delete cluster, nodes and containers deleted through cascade
		await e
			.delete(e.Cluster, (cluster) => ({
				filter_single: e.op(cluster.id, '=', e.uuid(id))
			}))
			.run(client);
	} else {
		// Update state of cluster in db
		await e
			.update(e.Cluster, () => ({
				filter_single: { id: cluster.id! },
				set: {
					tfstate: JSON.stringify(state)
				}
			}))
			.run(client);
	}

	return json({ success, message });
};
