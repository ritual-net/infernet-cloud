import { client, e } from '@db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

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
	const clusterResult = await e
		.insert(e.Cluster, {
			serviceAccount: e.select(e.ServiceAccount, () => ({
				filter_single: { id: service_account }
			}))
		})
		.run(client);

	// Create nodes
	const nodesResult = await e
		.params({ nodes: e.json }, ({ nodes }) => {
			return e.for(e.json_array_unpack(nodes), (node) => {
				return e.insert(e.InfernetNode, {
					config: node.config,
					cluster: e.select(e.Cluster, () => ({
						filter_single: { id: clusterResult.id }
					}))
				});
			});
		})
		.run(client, {
			nodes
		});

	// Create containers
	const containersResult = await e
		.params({ containers: e.json }, ({ containers }) => {
			return e.for(e.json_array_unpack(containers), (container) => {
				return e.insert(e.Container, {
					config: container.config,
					node: e.select(e.InfernetNode, () => ({
						filter_single: { id: e.cast(e.uuid, container.nodeId) }
					}))
				});
			});
		})
		.run(client, {
			containers: nodes.flatMap((node, index) =>
				node.containers.map((container: object) => ({
					config: container,
					nodeId: nodesResult[index].id
				}))
			)
		});

	//TODO: Use transaction to rollback if anything?

	return json({ cluster: clusterResult, nodes: nodesResult, containers: containersResult });
};
