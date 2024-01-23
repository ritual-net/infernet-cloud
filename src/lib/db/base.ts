import type { ProviderCluster, ProviderServiceAccount } from '$lib/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Queries {
	/**
	 * Get service account data by id
	 * @param id of service account
	 * @returns ProviderServiceAccount if found
	 */
	getServiceAccountById: (id: string) => Promise<ProviderServiceAccount | null>;
	/**
	 * Get cluster data by id
	 * @param id of cluster
	 * @returns ProviderCluster if found
	 */
	getClusterById: (id: string) => Promise<ProviderCluster | null>;
	/**
	 * Create insert query for cluster
	 * @param config of cluster
	 * @param service_account associated with cluster
	 * @param nodesQuery for inserting cluster nodes
	 * @returns insert query
	 */
	insertClusterQuery: (config: any, service_account: string, nodesQuery: any) => any;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
