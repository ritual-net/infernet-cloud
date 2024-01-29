import { client, e } from '$lib/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { AWSQueries } from '$lib/db/providers/aws';
import { GCPQueries } from '$lib/db/providers/gcp';
import type {
	GCPServiceAccount,
	AWSServiceAccount,
	GCPCluster,
	AWSCluster,
	InfernetNode,
} from '$schema/interfaces';
import { GCPNodeClient } from '$lib/node_clients/gcp';
import { AWSNodeClient } from '$lib/node_clients/aws';
import type { GCPNodeClientArgs, NodeInfo, ProviderCluster } from '$types/provider';
import { clusterAction } from '$lib/terraform/common';
import { NodeClient } from '$lib/index';
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

	// TODO: Make sure node belongs to user through auth

	const node = await e
		.select(e.InfernetNode, () => ({
			filter_single: { id },
		}))
		.run(client);

	const clusters = await e
		.select(e.Cluster, () => ({
			id: true,
			service_account: {
				id: true,
				provider: true,
				creds: true,
			},
			filter: e.op(node, 'in', cluster.nodes),
		}))
		.run(client);

	if (clusters.length !== 1) {
		return error(400, 'Cluster could not be retrieved');
	}
    // TODO refactor into common.ts

	const cluster = clusters[0];
	const provider = cluster.service_account.provider;
	const creds = cluster.service_account.creds;
	const nodeClient = new NodeClient[provider].class(creds);
	const args = NodeClient[provider].args(cluster);
	const nodeInfo = (await nodeClient.getNodesInfo([node.provider_id], args))[0];
	nodeInfo.node = node;
	return json(nodeInfo);
};

/**
 * Delete a node by its ID.
 *
 * @param params - The parameters object, expected to contain 'nodeId'.
 * @returns { id: string, success: boolean, message: string} - Node id, success
 * 		boolean, and Terraform message.
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
	const { error: errorMessage, success } = await clusterAction(cluster.id, provider, 'apply');
	return json({
		message: success ? 'Node destroyed successfully.' : errorMessage,
		success,
	});
};
