import { getNodesByIds, getClusterByNodeId } from '$/lib/db/queries';
import { NodeClient } from '$/lib/index';
import type { NodeInfo } from '$/types/provider';

/**
 * Given an array of InfernetNode ids and an action, complete action via node client.
 *
 * @param nodes - Array of InfernetNode ids to complete action on
 * @param action - Action to complete on nodes {start, stop, info}
 * @returns error or success message
 * @remarks nodes have to belong to same cluster
 */
export const executeNodeAction = async (
	nodeIds: string[],
	action: string
): Promise<NodeInfo[] | object> => {
	const nodes = await getNodesByIds(nodeIds);
	if (!nodes) {
		throw Error('Nodes could not be retrieved.');
	}

	const cluster = await getClusterByNodeId(nodeIds[0]);
	if (!cluster) {
		throw Error('Cluster could not be retrieved for nodes.');
	}

	const service_account = cluster.service_account;
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
			return { success: true, message: 'Started nodes.' };

		case NodeAction.stop:
			await nodeClient.stopNodes(providerIds, functionArgs);
			return { success: true, message: 'Stopped nodes.' };

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
