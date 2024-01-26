import { error, json } from '@sveltejs/kit';
import { getProviderByClusterId } from '$lib/db/common';
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

/**
 * Update a cluster by its ID.
 *
 * @param params - The parameters object, expected to contain 'clusterId'.
 * @param request - The request object can contain the following updateable fields:
 * 					- name: string
 * 					- deploy_router: boolean
 * 					- ip_allow_http: string
 * 					- ip_allow_https: string
 * @returns Cluster object ID.
 */
export const PATCH: RequestHandler = async ({ params, request }) => {
	const id = params.clusterId;

	if (!id) {
		return error(400, 'Cluster id is required');
	}

	// TODO: Make sure cluster belongs to user through auth

	const data = await request.json();
	if (!data || data.length === 0) {
		return error(400, 'At least one field is required');
	}

	// Update cluster
	const cluster = await e
		.update(e.Cluster, (c) => ({
			set: {
				// Updateable fields, default to current value if not provided
				name: e.op(data.name, '??', c.name),
				deploy_router: e.op(data.deploy_router, '??', c.deploy_router),
				...(data?.ip_allow_http ? { ip_allow_http: data.ip_allow_http } : {}),
				...(data?.ip_allow_https ? { ip_allow_https: data.ip_allow_https } : {}),
			},
			filter_single: { id },
		}))
		.run(client);

	if (!cluster) {
		return error(500, 'Failed to update cluster');
	}

	// Get service account
	const serviceAccountData = await e
		.select(e.Cluster, () => ({
			service_account: {
				id: true,
				provider: true,
			},
			filter_single: { id },
		}))
		.run(client);

	if (!serviceAccountData) {
		return error(500, 'Failed to fetch cluster and credentials from database');
	}

	const {
		service_account: { provider, id: serviceAccountId },
	} = serviceAccountData;

	// Get cluster and service account data
	const clusterData = await QueryByProvider[provider].getClusterById(cluster.id);
	const serviceAccount = await QueryByProvider[provider].getServiceAccountById(serviceAccountId);

	if (!clusterData || !serviceAccount) {
		return error(500, 'Failed to fetch cluster and credentials from database');
	}

	const { success, message, state } = await ProviderTerraform[provider].apply(
		clusterData,
		serviceAccount
	);

	await e
		.update(e.Cluster, () => ({
			filter_single: { id: cluster.id },
			set: {
				tfstate: JSON.stringify(state),
			},
		}))
		.run(client);

	if (success) {
		return json({ id: cluster.id, success, message: 'Cluster updated successfully' });
	}
	return json({ id: cluster.id, success, message });
};

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
				filter_single: e.op(cluster.id, '=', e.uuid(id)),
			}))
			.run(client);
		return json({ success, message: 'Cluster deleted successfully' });
	} else {
		// Update state of cluster in db
		await e
			.update(e.Cluster, () => ({
				filter_single: { id: cluster.id! },
				set: {
					tfstate: JSON.stringify(state),
				},
			}))
			.run(client);

		return json({ success, message });
	}
};
