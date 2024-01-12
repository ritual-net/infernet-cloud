import { client, e } from '@db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const id = params.clusterId;

	if (!id) {
		return error(400, 'Cluster id is required');
	}

	// TODO: Make sure cluster belongs to user through auth

	// Get cluster by id
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
			},
			filter_single: { id }
		}))
		.run(client);

	return json(result);
};

// export const PATCH: RequestHandler = async ({ params, request }) => {
// }

export const DELETE: RequestHandler = async ({ params }) => {
	const id = params.clusterId;

	// TODO: confirm cluster belongs to user through auth, before deleting

	if (!id) {
		return error(400, 'Cluster id is required');
	}

	// TODO: Call terraform to destroy cluster
	// If successful, delete cluster + nodes from db

	// Delete nodes
	await e
		.delete(e.InfernetNode, (node) => ({
			filter: e.op(node.cluster.id, '=', e.uuid(id))
		}))
		.run(client);

	// Delete cluster
	const cluster = await e
		.delete(e.Cluster, (cluster) => ({
			filter_single: e.op(cluster.id, '=', e.uuid(id))
		}))
		.run(client);

	return json(cluster);
};
