import { client, e } from '$/lib/db';
import { error, json } from '@sveltejs/kit';
import { clusterAction } from '$/lib/terraform/common';
import { TFAction } from '$/types/terraform';
import type { RequestHandler } from '@sveltejs/kit';
import { executeNodeAction } from '$/lib/clients/node/common';
import type { NodeInfo } from '$/types/provider';

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
        const nodeInfo = (await executeNodeAction([id], 'info') as NodeInfo[])[0];
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

	const node = e.select(e.InfernetNode, () => ({
		filter_single: { id },
	}));

	// Get cluster id and service account
	const clusters = await e
		.with(
			[node],
			e.select(e.Cluster, (cluster) => ({
				id: true,
				service_account: {
					id: true,
					provider: true,
				},
				filter: e.op(node, 'in', cluster.nodes),
			}))
		)
		.run(client);

	if (clusters.length !== 1) {
		return error(400, 'Cluster could not be retrieved');
	}

	const cluster = clusters[0];
	const provider = cluster.service_account.provider;

	// Delete node
	const deleteNodeQuery = e.delete(e.InfernetNode, () => ({
		filter_single: { id: e.uuid(id) },
	}));
	await e
		.with(
			[deleteNodeQuery],
			e.update(e.Cluster, () => ({
				filter_single: { id: cluster.id },
				set: {
					nodes: { '-=': deleteNodeQuery },
				},
			}))
		)
		.run(client);

	// Apply Terraform changes to cluster
	const { error: errorMessage, success } = await clusterAction(
		cluster.id,
		provider,
		TFAction.Apply
	);
	return json({
		message: success ? 'Node destroyed successfully.' : errorMessage,
		success,
	});
};
