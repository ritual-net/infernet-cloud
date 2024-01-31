import { error, json } from '@sveltejs/kit';
import { client, e } from '$/lib/db';
import { clusterAction } from '$/lib/terraform/common';
import { executeNodeAction } from '$/lib/clients/node/common';
import { getClusterByNodeId } from '$/lib/db/common';
import { NodeAction } from '$/types/provider';
import { TFAction } from '$/types/terraform';
import type { NodeInfo } from '$/types/provider';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Retrieve a node and its status/info by its ID.
 *
 * @param params - The parameters object, expected to contain 'nodeId'.
 * @returns NodeInfo object.
 */
export const GET: RequestHandler = async ({ params }) => {
	const id = params.nodeId;

	if (!id) {
		return error(400, 'Node id is required');
	}
	try {
		const nodeInfo = ((await executeNodeAction([id], NodeAction.info)) as NodeInfo[])[0];
		return json(nodeInfo);
	} catch (e) {
		return error(400, (e as Error).message);
	}
};

/**
 * Delete a node by its ID.
 *
 * @param params - The parameters object, expected to contain 'nodeId'.
 * @returns Success boolean and Terraform message.
 */
export const DELETE: RequestHandler = async ({ params }) => {
	const id = params.nodeId;

	if (!id) {
		return error(400, 'Node id is required');
	}

	// TODO: Make sure node belongs to user through auth

	// Get cluster id and service account
	const cluster = await getClusterByNodeId(id);

	if (!cluster) {
		return error(400, 'Cluster could not be retrieved');
	}

	// Delete node
	await e
		.update(e.Cluster, () => ({
			filter_single: { id: cluster.id },
			set: {
				nodes: {
					'-=': e.delete(e.InfernetNode, () => ({
						filter_single: { id: e.uuid(id) },
					})),
				},
			},
		}))
		.run(client);

	// Apply Terraform changes to cluster
	const { error: errorMessage, success } = await clusterAction(cluster.id, TFAction.Apply);
	return json({
		message: success ? 'Node destroyed successfully.' : errorMessage,
		success,
	});
};
