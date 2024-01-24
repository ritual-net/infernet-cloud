import { client, e } from '$lib/db';
import { ProviderTypeEnum } from '$types/provider';

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
			filter_single: { id: serviceAccountId }
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
				provider: true
			},
			filter_single: { id: clusterId }
		}))
		.run(client);

	return result ? (result.service_account.provider as ProviderTypeEnum) : null;
};
