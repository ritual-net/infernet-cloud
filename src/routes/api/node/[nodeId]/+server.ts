import { error, json } from '@sveltejs/kit';
import { clusterAction } from '$/lib/terraform/common';
import { e } from '$/lib/db';
import { nodeAction } from '$/lib/clients/node/common';
import { getClusterByNodeIds } from '$/lib/db/queries';
import { TFAction } from '$/types/terraform';
import { NodeAction, type InfernetNodeWithInfo } from '$/types/provider';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Retrieve a node and its status/info by its ID.
 *
 * @param locals - The locals object contains the client.
 * @param params - The parameters object, expected to contain 'nodeId'.
 * @returns NodeInfo object.
 */
export const GET: RequestHandler = async ({ locals: { client }, params, url }) => {
	const id = params.nodeId;

	const includeClusterBacklink = url.searchParams.has('includeClusterBacklink')

	if (!id) {
		return error(400, 'Node id is required');
	}
	try {
		const result = await nodeAction(client, [id], NodeAction.info, { includeClusterBacklink });

		return json({
			node: result.nodes[0].node,
			info: result.nodes[0].info,
			infoError: result.infoError?.message,
		} as InfernetNodeWithInfo);
	} catch (e) {
		return error(400, (e as Error).message);
	}
};

/**
 * Update a node by its ID.
 *
 * @param locals - The locals object contains the client.
 * @param params - The parameters object, expected to contain 'nodeId'.
 * @param request - The request body with node fields.
 * @returns Updated node ID.
 */
export const PATCH: RequestHandler = async ({
	locals: { client },
	params: { nodeId },
	request,
}) => {
	if (!nodeId)
		return error(400, 'Node id is required')

	// Get cluster id and service account
	const cluster = await getClusterByNodeIds(client, [nodeId])

	if (!cluster)
		return error(400, 'Cluster could not be retrieved')

	const body = await request.json()
	if (!body)
		return error(400, 'Body is required')

	const node = body

	// Update node
	const updatedNode = (
		await e
			.update(e.InfernetNode, () => ({
				filter_single: { id: node.id },
				set: {
					...node,
				},
			}))
			.run(client)
	)

	if(!updatedNode)
		return error(500, 'Node was not updated.')

	// Apply Terraform changes to updated cluster
	// (Run in background - don't block API response)
	;(async () => {
		let result: Awaited<ReturnType<typeof clusterAction>>

		try {
			result = await clusterAction(
				client,
				cluster.id,
				TFAction.Apply
			)
		} catch (e) {
			console.error(e)
		}

		if(result?.error)
			return error(500, result.error)
	})();

	return json({
		node: updatedNode,
	})
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

	if (!id)
		return error(400, 'Node id is required')

	// Get cluster id and service account
	const cluster = await getClusterByNodeIds(client, [id])

	if (!cluster)
		return error(400, 'Cluster could not be retrieved')

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

	if(result.error)
		return error(500, result.error)

	return json({
		node: deletedNode,
	})
};
