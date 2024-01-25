import type { TypeSet } from '$schema/edgeql-js/reflection';
import type { ProviderCluster, ProviderServiceAccount } from '$types/provider';

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
	 * @param serviceAccountId associated with cluster
	 * @param nodesQuery the Edgedb query for inserting ProviderCluster.nodes
	 * @returns insert query
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	insertClusterQuery: (config: any, serviceAccountId: string, nodesQuery: TypeSet<any, any>) => any;
}
