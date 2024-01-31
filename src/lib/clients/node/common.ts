import { getProviderByNodeId, getNodeById } from '$/lib/db/common';
import { NodeClient, ProviderQueries } from '$/lib/index';
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
): Promise<NodeInfo[] | Object> => {
	const nodes = await Promise.all(
		nodeIds.map(async (id) => {
			// TODO: Make sure node belongs to user through auth
			const node = await getNodeById(id);
			if (!node) {
				throw Error(`Node could not be retrieved for id ${id}`);
			}
			return node;
		})
	);

	const provider = await getProviderByNodeId(nodeIds[0]);
	if (!provider) {
		throw Error('Provider could not be retrieved for nodes.');
	}

	const cluster = await ProviderQueries[provider].getClusterByNodeId(nodeIds[0]);
	if (!cluster) {
		throw Error('Cluster could not be retrieved for nodes.');
	}

	const service_account = await ProviderQueries[provider].getServiceAccountById(
		cluster.service_account.id
	);
	if (!service_account) {
		throw Error('Service account could not be retrieved for cluster.');
	}

	const classArgs = NodeClient[provider].classArgs(cluster, service_account);
	const nodeClient = new NodeClient[provider].class(...classArgs);
	const functionArgs = NodeClient[provider].functionArgs(cluster, service_account);
	const providerIds = nodes.map((node) => node.provider_id!);

	switch (action) {
		case 'start':
			await nodeClient.startNodes(providerIds, functionArgs);
			return { success: true, message: 'Started nodes' };
		case 'stop':
			await nodeClient.stopNodes(providerIds, functionArgs);
			return { success: true, message: 'Stopped nodes' };
		case 'info':
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
