// Types
import z from 'yup';
import type { Node } from '$/routes/(signedIn)/clusters/create/schema';
import { TFAction } from '$/types/terraform';
import type { RequestHandler } from '@sveltejs/kit';


// Functions
import { error, json } from '@sveltejs/kit';
import { clusterAction } from '$/lib/terraform/common';
import { getClusterById } from '$/lib/db/queries';
import { createNodeParams, insertNodeQuery } from '$/lib/db/components';
import { e } from '$/lib/db';


/**
 * Add a node to a cluster.
 *
 * @param locals - The locals object contains the client.
 * @param request - The request object containing 'node' and 'cluster_id'.
 * @returns - Updated cluster ID.
 */
export const POST: RequestHandler = async ({ locals: { client }, request }) => {
	const { node, cluster_id: clusterId } = await request.json() as {
		node: z.InferType<typeof Node>,
		cluster_id: string,
	};

	if (!node || !clusterId) {
		return error(400, 'Data and cluster id are required');
	}

	// EdgeDB doesn't yet allow optional values within tuples.
	// https://github.com/edgedb/rfcs/blob/master/text/1022-freetypes.rst
	// Manually initialize nested undefined keys that were omitted from JSON serialization
	node.snapshot_sync.sleep ??= 1.0
	node.snapshot_sync.batch_size ??= 200

	const cluster = await getClusterById(client, clusterId, { includeServiceAccountCredentials: true, includeNodeDetails: true });
	if (!cluster) {
		return error(400, `Cluster ID ${clusterId} does not exist`);
	}

	let updatedCluster: {
		id: string;
	} | null

	try {
		// Create node and update cluster
		updatedCluster = await e
			.params(
				{
					node: createNodeParams,
				},
				({ node }) =>
					e.update(e.Cluster, () => ({
						set: {
							nodes: {
								'+=': insertNodeQuery(node),
							},
						},
						filter_single: { id: clusterId },
					}))
			)
			.run(client, { node });
	} catch (e) {
		return error(400, (e as Error).message);
	}

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
		cluster: updatedCluster,
	})
};
