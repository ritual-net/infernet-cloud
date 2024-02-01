import { error, json } from '@sveltejs/kit';
import { executeNodeAction } from '$/lib/clients/node/common';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Stop a node by its id.
 *
 * @param locals - The locals object contains the client.
 * @param params - The parameters object, expected to contain 'nodeId'.
 * @returns success boolean and message.
 */
export const POST: RequestHandler = async ({ locals, params }) => {
	const id = params.nodeId;

	if (!id) {
		return error(400, 'Node id is required');
	}
	try {
		return json(await executeNodeAction(locals.client, [id], 'stop'));
	} catch (e) {
		return error(400, (e as Error).message);
	}
};
