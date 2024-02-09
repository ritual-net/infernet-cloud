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
 * @returns - Success boolean and Terraform message.
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

	// Create node and update cluster
	await e
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

	// Apply Terraform changes to cluster
	const { error: errorMessage, success } = await clusterAction(client, clusterId, TFAction.Apply);
	return json({ message: success ? 'Node created successfully' : errorMessage, success });
};
