import { client, e } from '$lib/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Retrieve a node by its ID.
 *
 * @param params - The parameters object, expected to contain 'nodeId'.
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
			...e.InfernetNode['*'],
			containers: {
				...e.Container['*'],
			},
			filter_single: { id },
		}))
		.run(client);

	// TODO: provider_id in node object if aws query, if gcp access project and zone as well for node
	// go through and figure out how to find out what provider a node is on
	// write function to get cluster given node id
	return json(result);
};

// TODO: PATCH

// TODO: DELETE
