/* eslint-disable no-case-declarations */
import { getNodesByIds, getClusterByNodeIds } from '$/lib/db/queries';
import { NodeClient } from '$/lib/index';
import { NodeAction } from '$/types/provider';
import type { Client } from 'edgedb';
import type {
	NodeInfo,
	ProviderServiceAccount,
	ProviderServiceAccountCreds,
} from '$/types/provider';

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
	if (nodes.length === 0) {
		throw Error('Nodes could not be retrieved.');
	}

	const cluster = await getClusterByNodeIds(client, nodeIds, true);
	if (!cluster) {
		throw Error('Cluster could not be retrieved.');
	}

	const serviceAccount = cluster.service_account as ProviderServiceAccount;
	const provider = serviceAccount.provider;

	const classArgs = NodeClient[provider].classArgs(cluster, serviceAccount) as [
		ProviderServiceAccountCreds,
		string,
	];
	const nodeClient = new NodeClient[provider].class(...classArgs);
	const functionArgs = NodeClient[provider].functionArgs(cluster, serviceAccount);
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
