import { client, e } from '$/lib/db';
import { ProviderTypeEnum } from '$/types/provider';
import type { InfernetNode } from '$schema/interfaces';

/**
 * Get the provider of a service account
 *
 * @param serviceAccountId Service account id
 * @returns Provider type if found
 */
export const getProviderByServiceAccountId = async (
	serviceAccountId: string
): Promise<ProviderTypeEnum | null> => {
	const result = await e
		.select(e.ServiceAccount, () => ({
			provider: true,
			filter_single: { id: serviceAccountId },
		}))
		.run(client);

	return result ? (result.provider as ProviderTypeEnum) : null;
};

/**
 * Get the provider of a cluster
 *
 * @param clusterId Cluster id
 * @returns Provider type if found
 */
export const getProviderByClusterId = async (
	clusterId: string
): Promise<ProviderTypeEnum | null> => {
	const result = await e
		.select(e.Cluster, () => ({
			service_account: {
				provider: true,
			},
			filter_single: { id: clusterId },
		}))
		.run(client);

	return result ? (result.service_account.provider as ProviderTypeEnum) : null;
};

/**
 * Get node data by node ids
 *
 * @param nodeIds of nodes
 * @returns InfernetNodes array if found
 */
export const getNodesByIds = async (nodeIds: string[]): Promise<InfernetNode[] | null> => {
	const allNodes = await e
		.select(e.InfernetNode, () => ({
			...e.InfernetNode['*'],
			containers: {
				...e.Container['*'],
			},
		}))
		.run(client);

	const nodes = allNodes.filter((node) => nodeIds.includes(node.id));
	return nodes.length > 0 ? nodes : null;
};

/**
 * Get provider by node id
 *
 * @param nodeId of node
 * @returns ProviderType if found
 */
export const getProviderByNodeId = async (nodeId: string): Promise<ProviderTypeEnum | null> => {
	const node = e.select(e.InfernetNode, () => ({
		filter_single: { id: nodeId },
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
	return clusters ? (clusters[0].service_account.provider as ProviderTypeEnum) : null;
};

/**
 * Generic params for inserting an InfernetNode
 */
export const createNodeParams = e.tuple({
	config: e.tuple({
		chain_enabled: e.bool,
		trail_head_blocks: e.int16,
		rpc_url: e.str,
		coordinator_address: e.str,
		max_gas_limit: e.int64,
		private_key: e.str,
		forward_stats: e.bool,
	}),
	containers: e.array(
		e.tuple({
			image: e.str,
			container_id: e.str,
			description: e.str,
			external: e.bool,
			allowed_addresses: e.array(e.str),
			allowed_delegate_addresses: e.array(e.str),
			allowed_ips: e.array(e.str),
			command: e.str,
			env: e.json,
			gpu: e.bool,
		})
	),
});
