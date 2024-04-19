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

	// Apply Terraform changes to created cluster
	// (Run in background - don't block API response)
	(async () => {
		let result: Awaited<ReturnType<typeof clusterAction>>

		try {
			result = await clusterAction(
				client,
				cluster.id,
				TFAction.Apply
			);
		} catch (e) {
			console.error(e)

			// return error(500, JSON.stringify(e))
		}

		// const { success, error: errorMessage } = result

		// if(!success)
		// 	return error(500, errorMessage)
	})();

	return json({
		cluster: updatedCluster,
	})
};
