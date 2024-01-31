import { client, e } from '$/lib/db';
import { ProviderTypeEnum } from '$/types/provider';

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
