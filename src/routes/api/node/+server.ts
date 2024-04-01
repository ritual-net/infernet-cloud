import { error, json } from '@sveltejs/kit';
import { clusterAction } from '$/lib/terraform/common';
import { getClusterById } from '$/lib/db/queries';
import { createNodeParams, insertNodeQuery } from '$/lib/db/components';
import { e } from '$/lib/db';
import { TFAction } from '$/types/terraform';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Add a node to a cluster.
 *
 * @param locals - The locals object contains the client.
 * @param request - The request object containing 'node' and 'cluster_id'.
 * @returns - Updated cluster ID.
 */
export const POST: RequestHandler = async ({ locals: { client }, request }) => {
	const { node, cluster_id: clusterId } = await request.json();
	if (!node || !clusterId) {
		return error(400, 'Data and cluster id are required');
	}

	const cluster = await getClusterById(client, clusterId, true);
	if (!cluster) {
		return error(400, `Cluster ID ${clusterId} does not exist`);
	}

	let updatedCluster: {
		id: string;
	} | null;

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

	let result: Awaited<ReturnType<typeof clusterAction>>;

	try {
		// Apply Terraform changes to cluster
		result = await clusterAction(client, cluster.id, TFAction.Apply);
	} catch (e) {
		console.error(e);

		return error(500, JSON.stringify(e));
	}

	const { success, error: errorMessage } = result;

	if (!success) return error(500, errorMessage);

	return json({
		cluster: updatedCluster,
	});
};
