import { client, e, type $infer } from '$db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Retrieve a node by its ID.
 *
 * @param params - The request parameters object, expected to contain 'nodeId'.
 * @returns Node object.
 */
export const GET: RequestHandler = async ({ params }) => {
	const id = params.nodeId;

	if (!id) {
		return error(400, 'Node id is required');
	}

	// TODO: Make sure node belongs to user through auth

	// Get node by id
	const result = await e
		.select(e.InfernetNode, () => ({
			id: true,
			config: true,
			containers: {
				id: true,
				config: true
			},
			cluster: {
				id: true
			},
			filter_single: { id }
		}))
		.run(client);

	return json(result);
};

/**
 * Modify a node by its ID.
 *
 * @param params - The request parameters object, expected to contain 'nodeId'.
 * @param request - The request object containing the new node config.
 * @returns Updated Node object.
 */
export const PATCH: RequestHandler = async ({ params, request }) => {
	const id = params.nodeId;
	const newConfig = await request.json();

	if (!id) {
		return error(400, 'Node id is required');
	}

	// TODO: Make sure node belongs to user through auth

	// Get node by id
	const node = await e
		.select(e.InfernetNode, () => ({
			config: true,
			filter_single: { id }
		}))
		.run(client);

	if (!node) {
		return error(400, 'Node not found');
	}

	// Update existing node config with new config values
	const config = node.config as Record<string, unknown>;
	Object.keys(newConfig).forEach((key) => {
		config[key] = newConfig[key];
	});

	// Update node
	const newNode = await e
		.update(e.InfernetNode, (node) => ({
			filter_single: e.op(node.id, '=', e.uuid(id)),
			set: {
				config
			}
		}))
		.run(client);

	// TODO: Call terraform to update cluster, get back state file, update node.

	return json(newNode);
};

/**
 * Delete a node by its ID.
 *
 * @param params - The request parameters object, expected to contain 'nodeId'.
 * @returns ID of the deleted Node.
 */
export const DELETE: RequestHandler = async ({ params }) => {
	const id = params.nodeId;

	// TODO: confirm node belongs to user through auth, before deleting

	if (!id) {
		return error(400, 'Node id is required');
	}

	// TODO: Call terraform to update cluster
	// If successful, delete node

	// Delete cluster, nodes and containers deleted through cascade
	const node = await e
		.delete(e.InfernetNode, (node) => ({
			filter_single: e.op(node.id, '=', e.uuid(id))
		}))
		.run(client);

	return json(node);
};
