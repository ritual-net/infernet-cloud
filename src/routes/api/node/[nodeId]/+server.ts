import { error, json } from '@sveltejs/kit';
import { clusterAction } from '$/lib/terraform/common';
import { e } from '$/lib/db';
import { nodeAction } from '$/lib/clients/node/common';
import { getClusterByNodeIds } from '$/lib/db/queries';
import { TFAction } from '$/types/terraform';
import { NodeAction, type NodeInfo } from '$/types/provider';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Retrieve a node and its status/info by its ID.
 *
 * @param locals - The locals object contains the client.
 * @param params - The parameters object, expected to contain 'nodeId'.
 * @returns NodeInfo object.
 */
export const GET: RequestHandler = async ({ locals: { client }, params }) => {
	const id = params.nodeId;

	if (!id) {
		return error(400, 'Node id is required');
	}
	try {
		const nodeInfo = (await nodeAction(client, [id], NodeAction.info))[0];
		return json(nodeInfo);
	} catch (e) {
		return error(400, (e as Error).message);
	}
};

/**
 * Delete a node by its ID.
 *
 * @param locals - The locals object contains the client.
 * @param params - The parameters object, expected to contain 'nodeId'.
 * @returns Deleted node ID.
 */
export const DELETE: RequestHandler = async ({ locals: { client }, params }) => {
	const id = params.nodeId;

	if (!id) {
		return error(400, 'Node id is required');
	}

	// Get cluster id and service account
	const cluster = await getClusterByNodeIds(client, [id]);

	if (!cluster) {
		return error(400, 'Cluster could not be retrieved');
	}

	// Delete node
	const deletedNode = await e
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

	if(!deletedNode)
		return error(500, 'No node to delete.')

	// Apply Terraform changes to cluster
	let result: Awaited<ReturnType<typeof clusterAction>>

	try {
		// Apply Terraform changes to cluster
		result = await clusterAction(
			client,
			cluster.id,
			TFAction.Apply
		);
	} catch (e) {
		console.error(e)

		return error(500, JSON.stringify(e))
	}

	const { success, error: errorMessage } = result

	if(!success)
		return error(500, errorMessage)

	return json({
		node: deletedNode,
	})
};
