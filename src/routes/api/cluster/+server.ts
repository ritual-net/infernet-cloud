import { error, json } from '@sveltejs/kit';
import { ClusterTypeByProvider, e } from '$/lib/db';
import { clusterAction } from '$/lib/terraform/common';
import { createNodeParams, insertNodeQuery } from '$/lib/db/components';
import { getServiceAccountById } from '$/lib/db/queries';
import { TFAction } from '$/types/terraform';
import type { Cluster } from '$schema/interfaces';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Fetch all clusters for a user.
 *
 * @param locals - The locals object contains the client.
 * @returns Array of Cluster objects.
 */
export const GET: RequestHandler = async ({ locals: { client } }) => {
	// Get all clusters for user
	const result = await e
		.select(e.Cluster, (cluster) => ({
			service_account: {
				id: true,
				name: true,
				provider: true,
			},
			id: true,
			name: true,
			node_count: e.count(cluster.nodes),
		}))
		.run(client);

	return json(result);
};

/**
 * Create a new cluster with a given service account and an array of node configs.
 *
 * @param locals - The locals object contains the client.
 * @param request - The request object containing 'serviceAccountId', 'config', 'nodes'.
 * @returns Cluster ID, success boolean, and Terraform message.
 */
export const POST: RequestHandler = async ({ locals: { client }, request }) => {
	const { serviceAccountId, config, nodes } = await request.json();

	if (!serviceAccountId || !config || !nodes || !Array.isArray(nodes) || nodes.length === 0) {
		return error(400, 'Service account and at least one node are required');
	}

	// Get provider of service account
	const serviceAccount = await getServiceAccountById(client, serviceAccountId, true);
	if (!serviceAccount) {
		return error(400, 'Service account could not be retrieved');
	}

	// Create cluster
	const cluster = (await e
		.params(
			{
				nodes: e.array(createNodeParams),
			},
			({ nodes }) =>
				// Choose cluster type based on provider
				e.insert(ClusterTypeByProvider[serviceAccount.provider], {
					...config,
					service_account: e.select(e.ServiceAccount, () => ({
						filter_single: { id: serviceAccountId },
					})),
					nodes: e.for(e.array_unpack(nodes), (node) => insertNodeQuery(node)),
				})
		)
		.run(client, { nodes })) as Cluster;

	if (!cluster) {
		return error(500, 'Failed to create cluster');
	}

	// Apply Terraform changes to create cluster
	const { error: errorMessage, success } = await clusterAction(client, cluster.id, TFAction.Apply);
	return json({
		id: cluster.id,
		message: success ? 'Cluster created successfully' : errorMessage,
		success,
	});
};
