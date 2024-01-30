import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getClusterByNodeId, getNodeById } from '$lib/db/common';
import type { ProviderTypeEnum, ProviderServiceAccount } from '$types/provider';
import { NodeClient } from '$lib/index';

/**
 * Start a node by its ID.
 *
 * @param params - The parameters object, expected to contain 'nodeId'.
 * @returns True if successful.
 */
export const POST: RequestHandler = async ({ params }) => {
	const id = params.nodeId;

	if (!id) {
		return error(400, 'Node id is required');
	}

	// TODO: Make sure node belongs to user through auth

	const node = await getNodeById(id);
	const cluster = await getClusterByNodeId(id);
	if (!node || !cluster) {
		return error(400, 'Node could not be retrieved or it does not belong to a cluster.');
	}
	const provider = cluster.service_account.provider as ProviderTypeEnum;
	const creds = (cluster.service_account as ProviderServiceAccount).creds;
	const nodeClient = new NodeClient[provider].class(creds);
	const args = NodeClient[provider].args(cluster);
	try {
		await nodeClient.startNodes([node.provider_id], args);
	} catch (err) {
		return error(500, `Error when starting node ${(err as Error).message}`);
	}
	return json({ id: id, success: true, message: 'Node started successfully' });
};
