import { error, json } from '@sveltejs/kit';
import { QueryByProvider, client, e } from '$/lib/db';
import { getServiceAccountById } from '$/lib/db/common';
import { createNodeParams, insertNodeQuery } from '$/lib/db/queries';
import { clusterAction } from '$/lib/terraform/common';
import { TFAction } from '$/types/terraform';
import type { Cluster } from '$schema/interfaces';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Fetch all clusters for a user.
 *
 * @param request - The request object containing 'user'.
 * @returns Array of Cluster objects.
 */
export const GET: RequestHandler = async ({ request }) => {
	const url = new URL(request.url);
	const user = url.searchParams.get('user');

	if (!user) {
		return error(400, 'User id is required');
	}
	// TODO: Get user id from auth

	// Get all clusters for user
	const result = await e
		.select(e.Cluster, (cluster) => ({
			service_account: {
				name: true,
				provider: true,
			},
			id: true,
			name: true,
			node_count: e.count(cluster.nodes),
			filter: e.op(cluster.service_account.user.id, '=', e.uuid(user)),
		}))
		.run(client);

	return json(result);
};

/**
 * Create a new cluster with a given service account and an array of node configs.
 *
 * @param request - The request object containing 'serviceAccountId', 'config', 'nodes'.
 * @returns Cluster ID, success boolean, and Terraform message.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { serviceAccountId, config, nodes } = await request.json();

	if (!serviceAccountId || !config || !nodes || !Array.isArray(nodes) || nodes.length === 0) {
		return error(400, 'Service account and at least one node are required');
	}

	// TODO: Make sure service account belongs to user through auth

	// TODO: Enforce correctness of config, nodes + containers?

	// Get provider of service account
	const serviceAccount = await getServiceAccountById(serviceAccountId);
	if (!serviceAccount) {
		return error(400, 'Service account could not be retrieved');
	}

	// Create cluster
	const cluster = (await e
		.params(
			{
				nodes: e.array(createNodeParams),
			},
			({ nodes }) => {
				// Choose cluster type based on provider
				return QueryByProvider[serviceAccount.provider].insertClusterQuery(
					config,
					serviceAccountId,
					e.for(e.array_unpack(nodes), (node) => insertNodeQuery(node))
				);
			}
		)
		.run(client, { nodes })) as Cluster;

	if (!cluster) {
		return error(500, 'Failed to create cluster');
	}

	// Apply Terraform changes to create cluster
	const { error: errorMessage, success } = await clusterAction(cluster.id, TFAction.Apply);
	return json({
		id: cluster.id,
		message: success ? 'Cluster created successfully' : errorMessage,
		success,
	});
};
