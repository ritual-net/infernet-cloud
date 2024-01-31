import { e } from '$/lib/db';
import type { Queries } from '$/lib/db/base';
import type { Cardinality, TypeSet } from '$schema/edgeql-js/reflection';
import type { $AWSCluster, $InfernetNode } from '$schema/edgeql-js/modules/default';

export const AWSQueries: Queries<$AWSCluster> = {
	/**
	 * Create insert query for AWSCluster
	 *
	 * @param config of cluster
	 * @param serviceAccountId associated with cluster
	 * @param nodesQuery the Edgedb query for inserting AWSCluster.nodes
	 * @returns insert query
	 */
	insertClusterQuery(
		config: {
			name: string;
			deploy_router: boolean;
			ip_allow_http: string[];
			ip_allow_ssh: string[];
			region: string;
			machine_type: string;
		},
		serviceAccountId: string,
		nodesQuery: TypeSet<$InfernetNode, Cardinality.Many>
	) {
		return e.insert(e.AWSCluster, {
			...config,
			service_account: e.select(e.ServiceAccount, () => ({
				filter_single: { id: serviceAccountId },
			})),
			nodes: nodesQuery,
		});
	},
};
