import { client, e } from '$db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Fetch all clusters for a user.
 *
 * @returns Array of Cluster objects.
 */
export const GET: RequestHandler = async () => {
	// TODO: Get user id from auth

	// Get all clusters for user
	const result = await e
		.select(e.Cluster, () => ({
			id: true,
			serviceAccount: {
				id: true,
				provider: true
			},
			nodes: {
				id: true,
				config: true
			}
			// TODO: Filter by user id from auth
			// filter: e.op(cluster.serviceAccount.user.id, '=', e.uuid(user.id))
		}))
		.run(client);

	return json(result);
};

/**
 * Create a new cluster with a given service account and an array of node configs.
 *
 * @param request - The request object containing 'service_account' and 'nodes'.
 * @returns Cluster object.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { service_account, nodes } = await request.json();

	if (!service_account || !nodes || !Array.isArray(nodes) || nodes.length === 0) {
		return error(400, 'Service account and at least one node are required');
	}

	// TODO: Make sure service account belongs to user through auth

	// TODO: Call terraform to create cluster, get back state file
	// If successful, insert cluster + nodes into db

	// TODO: Function(s) to enforce correctness of cluster and node parameters,
	// can be reused when PATCHING

	// Create cluster
	const cluster = await e
		.insert(e.Cluster, {
			serviceAccount: e.select(e.ServiceAccount, () => ({
				filter_single: { id: service_account }
			}))
		})
		.run(client);

	await e
		.params({ nodes: e.json }, ({ nodes }) => {
			// Create nodes
			return e.for(e.json_array_unpack(nodes), (node) => {
				const infernetNode = e.insert(e.InfernetNode, {
					config: node.config,
					cluster: e.select(e.Cluster, () => ({
						filter_single: { id: cluster.id }
					}))
				});
				return e.with(
					[infernetNode],
					// Create containers
					e.for(e.json_array_unpack(node.containers), (container) => {
						return e.insert(e.Container, {
							config: container,
							node: infernetNode
						});
					})
				);
			});
		})
		.run(client, { nodes });

	return json(cluster);
};
