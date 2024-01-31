import type { BaseType, Cardinality, TypeSet } from '$schema/edgeql-js/reflection';
import type { $InfernetNode } from '$schema/edgeql-js/modules/default';

export interface Queries<T extends BaseType> {
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
}
