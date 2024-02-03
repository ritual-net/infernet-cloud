/* eslint-disable no-case-declarations */
import { getNodesByIds, getClusterByNodeId } from '$/lib/db/queries';
import { NodeClient } from '$/lib/index';
import { NodeAction } from '$/types/provider';
import type { Client } from 'edgedb';
import type { InfernetNode } from '$schema/interfaces';
import type {
	NodeInfo,
	ProviderCluster,
	ProviderServiceAccount,
	ProviderServiceAccountCreds,
} from '$/types/provider';

/**
 * Returns cluster of set of nodes while asserting they belong to same cluster.
 * 
 * @param nodes - Array of InfernetNode objects
 * @returns ProviderCluster object
 * @throws Error if nodes do not belong to same cluster, no nodes provided, cluster could not be retrieved
 */
export const getNodesClusterId = async (client: Client, nodes: InfernetNode[]): Promise<ProviderCluster> => {
    if (nodes.length === 0) {
        throw Error('No nodes provided.');
    }

    const firstNode = nodes[0];
    const cluster = await getClusterByNodeId(client, firstNode.id);

    if (!cluster) {
        throw Error('Cluster could not be retrieved.');
    }

    for (let node of nodes) {
        const nodeCluster = await getClusterByNodeId(client, node.id);
        if (nodeCluster!.id !== cluster.id) {
            throw Error('Nodes do not belong to the same cluster.');
        }
    }

    return cluster;
}

/**
 * Applies the given action to a node and returns the result.
 *
 * @param client - The database client
 * @param nodes - Array of InfernetNode IDs
 * @param action - The action to perform on the node
 * @returns error or success message
 * @throws Error if nodes, cluster could not be retrieved, or action is not supported
 * @remarks nodes have to belong to same cluster
 */
export const nodeAction = async (
	client: Client,
	nodeIds: string[],
	action: NodeAction
): Promise<NodeInfo[] | undefined> => {
	const nodes = await getNodesByIds(client, nodeIds);
	if (!nodes) {
		throw Error('Nodes could not be retrieved.');
	}

	const cluster = await getNodesClusterId(client, nodes);

	const service_account = cluster.service_account as ProviderServiceAccount;
	const provider = service_account.provider;

	const classArgs = NodeClient[provider].classArgs(cluster, service_account) as [
		ProviderServiceAccountCreds,
		string,
	];
	const nodeClient = new NodeClient[provider].class(...classArgs);
	const functionArgs = NodeClient[provider].functionArgs(cluster, service_account);
	const providerIds = nodes.map((node) => node.provider_id!);

	switch (action) {
		case NodeAction.start:
			await nodeClient.startNodes(providerIds, functionArgs);
			return;

		case NodeAction.stop:
			await nodeClient.stopNodes(providerIds, functionArgs);
			return;

		case NodeAction.info:
			const nodesInfo = await nodeClient.getNodesInfo(providerIds, functionArgs);
			// add node objects to node info before returning
			const nodesMap = new Map(nodes.map((node) => [node.provider_id, node]));
			nodesInfo.forEach((nodeInfo) => {
				nodeInfo.node = nodesMap.get(nodeInfo.id);
			});
			return nodesInfo;

		default:
			throw Error(`Action ${action} not supported`);
	}
};
