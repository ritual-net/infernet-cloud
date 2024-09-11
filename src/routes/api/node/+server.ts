// Types
import z from 'yup';
import { TFAction } from '$/types/terraform';
import type { RequestHandler } from '@sveltejs/kit';


// Schema
import { type FormData, setDefaultNodeValues } from '$/routes/(signedIn)/clusters/[clusterId]/add-node/schema';


// Functions
import { error, json } from '@sveltejs/kit';
import { clusterAction } from '$/lib/terraform/common';
import { getClusterById } from '$/lib/db/queries';
// import { createNodeParams, nodeQueryFields } from '$/lib/db/components'
import { nodeJsonQueryFields } from '$/lib/db/components';
import { e } from '$/lib/db';

/**
 * Add a node to a cluster.
 *
 * @param locals - The locals object contains the client.
 * @param request - The request object containing 'node' and 'cluster_id'.
 * @returns - Updated cluster ID.
 */
export const POST: RequestHandler = async ({ locals: { client }, request }) => {
	const { node, clusterId } = await request.json() as z.InferType<typeof FormData>;

	if (!node || !clusterId) {
		return error(400, 'Data and cluster id are required');
	}

	// setDefaultNodeValues(node);

	const cluster = await getClusterById(client, clusterId, { includeServiceAccountCredentials: true, includeNodeDetails: true });
	if (!cluster) {
		return error(400, `Cluster ID ${clusterId} does not exist`);
	}

	console.log('Add node to cluster', { clusterId, node })

	let updatedCluster: {
		id: string;
	} | null

	try {
		// Create node and update cluster
		updatedCluster = await e
			.params(
				{
					node: e.json,
				},
				({ node }) =>
					e.update(e.Cluster, () => ({
						set: {
							nodes: {
								// '+=': e.insert(e.InfernetNode, nodeQueryFields(node)),
								'+=': e.insert(e.InfernetNode, nodeJsonQueryFields(node)),
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
		}
	})();

	return json({
		cluster: updatedCluster,
	})
};
