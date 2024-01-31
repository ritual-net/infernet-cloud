import type { ProviderCluster, ProviderServiceAccount } from '$/types/provider';
import type { BaseType, Cardinality, TypeSet } from '$schema/edgeql-js/reflection';
import type { $InfernetNode } from '$schema/edgeql-js/modules/default';

export interface Queries<T extends BaseType> {
	/**
	 * Get service account data by id
	 *
	 * @param id of service account
	 * @returns ProviderServiceAccount if found
	 */
	getServiceAccountById: (id: string) => Promise<ProviderServiceAccount | null>;

	/**
	 * Get cluster data by id
	 *
	 * @param id of cluster
	 * @returns ProviderCluster if found
	 */
	getClusterById: (id: string) => Promise<ProviderCluster | null>;

	/**
	 * Create insert query for cluster
	 *
	 * @param config of cluster
	 * @param serviceAccountId associated with cluster
	 * @param nodesQuery the Edgedb query for inserting ProviderCluster.nodes
	 * @returns insert query
	 */
	insertClusterQuery: (
		config: any,
		serviceAccountId: string,
		nodesQuery: TypeSet<$InfernetNode, Cardinality.Many>
	) => TypeSet<T, Cardinality.One>;

	/**
	 * Create insert query for node
	 *
	 * @param clusterId associated with node
	 * @param nodeQuery the Edgedb query for inserting an InfernetNode
	 * @returns insert query
	 */
	insertNodeToClusterQuery: (
		clusterId: string,
		nodeQuery: TypeSet<$InfernetNode, Cardinality.One>
	) => TypeSet<T, Cardinality.AtMostOne>;
}
