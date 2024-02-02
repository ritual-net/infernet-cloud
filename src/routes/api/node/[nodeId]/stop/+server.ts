import { error, json } from '@sveltejs/kit';
import { executeNodeAction } from '$/lib/clients/node/common';
import { NodeAction } from '$/types/provider';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Stop a node by its id.
 *
 * @param params - The parameters object, expected to contain 'nodeId'.
 * @returns success boolean and message.
 */
export const POST: RequestHandler = async ({ params }) => {
	const id = params.nodeId;

	if (!id) {
		return error(400, 'Node id is required');
	}
	try {
		return json(await executeNodeAction([id], NodeAction.stop));
	} catch (e) {
		return error(400, (e as Error).message);
	}
};
