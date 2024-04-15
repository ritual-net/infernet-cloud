/* eslint-disable no-case-declarations */
import { getNodesByIds, getClusterByNodeIds, getClusterByRouterId } from '$/lib/db/queries';
import { NodeClient } from '$/lib/index';
import { NodeAction } from '$/types/provider';
import type { Client } from 'edgedb';
import type {
	InfernetNodeWithInfo,
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
export const nodeAction = async <
	_NodeAction extends NodeAction
>(
	client: Client,
	nodeIds: string[],
	action: _NodeAction,
	{
		includeClusterBacklink = false,
	}: {
		includeClusterBacklink?: boolean,
	} = {}
): Promise<
	_NodeAction extends NodeAction.info
		? {
			nodes: InfernetNodeWithInfo[],
			infoError?: Error,
		}
		: undefined
> => {
	const nodes = await getNodesByIds(client, nodeIds, { includeClusterBacklink });
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
			let infoError: Error | undefined;

			const nodesInfo = await nodeClient
				.getNodesInfo(providerIds, functionArgs)
				.catch(error => {
					console.error(error);
					infoError = error;
					return [];
				});

			const nodeInfoByProviderId = new Map(nodesInfo.map(node => [node.id, node]));

			return {
				nodes: nodes
					.map(node => ({
						node,
						info: node.provider_id ? nodeInfoByProviderId.get(node.provider_id) : undefined,
					} as InfernetNodeWithInfo)),
				infoError,
			};

		case NodeAction.restart:
			await nodeClient.restartNodes(providerIds, functionArgs);
			return;

		default:
			throw Error(`Action ${action} not supported`);
	}
};

/**
 * Applies the given action to a router and returns the result.
 *
 * @param client - The database client
 * @param id - id of the router
 * @param action - The action to perform on the router
 * @throws Error if router could not be retrieved, or action is not supported
 */
export const routerAction = async (
	client: Client,
	id: string,
	action: NodeAction
): Promise<undefined> => {
	const cluster = await getClusterByRouterId(client, id, true);
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

	switch (action) {
		case NodeAction.restart:
			await nodeClient.restartNodes([id], functionArgs);
			return;

		default:
			throw Error(`Action ${action} not supported`);
	}
};
