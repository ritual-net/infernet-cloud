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
				...e.Container['*']
			},
			filter_single: { id }
		}))
		.run(client);

	return json(result);
};

// TODO: PATCH

// TODO: DELETE
