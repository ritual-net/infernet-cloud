import { client, e } from '$lib/db';
import { ProviderTypeEnum } from '$types/provider';
import type { ProviderCluster } from '$types/provider';
import type { InfernetNode } from '$schema/interfaces';

/**
 * Get the provider of a service account
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
 * Get node data by node id
 * @param id of node
 * @returns ProviderCluster if found
 */

export const getNodeById = async (id: string): Promise<InfernetNode | null> => {
	const node = await e
		.select(e.InfernetNode, () => ({
			...e.InfernetNode['*'],
			containers: {
				...e.Container['*'],
			},
			filter_single: { id },
		}))
		.run(client);
	return node;
};

/**
 * Get cluster data by node id
 * @param id of node
 * @returns ProviderCluster if found
 */
export const getClusterByNodeId = async (id: string): Promise<ProviderCluster | null> => {
	const clusters = await e
		.select(e.Cluster, () => ({
			service_account: {
				id: true,
				name: true,
				provider: true,
				user: {
					...e.User['*'],
				},
			},
			nodes: {
				...e.InfernetNode['*'],
				containers: {
					...e.Container['*'],
				},
			},
			...e.AWSCluster['*'],
		}))
		.run(client);
	for (const cluster of clusters) {
		if (cluster.nodes.some((node) => node.id === id)) {
			return cluster;
		}
	}
	return null;
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
