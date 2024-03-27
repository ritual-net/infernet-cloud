import { error, text } from '@sveltejs/kit';
import { nodeAction } from '$/lib/clients/node/common';
import { NodeAction } from '$/types/provider';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Restart a node by its id.
 *
 * @param locals - The locals object contains the client.
 * @param params - The parameters object, expected to contain 'nodeId'.
 * @returns success boolean and message.
 */
export const POST: RequestHandler = async ({ locals: { client }, params }) => {
	const id = params.nodeId;

	if (!id) {
		return error(400, 'Node id is required');
	}
	try {
		await nodeAction(client, [id], NodeAction.restart);
		return text('Restarting nodes...');
	} catch (e) {
		return error(400, (e as Error).message);
	}
};
