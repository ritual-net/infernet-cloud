import { e } from '$/lib/db';
import type { Queries } from '$/lib/db/base';
import type { Cardinality, TypeSet } from '$schema/edgeql-js/reflection';
import type { $GCPCluster, $InfernetNode } from '$schema/edgeql-js/modules/default';

export const GCPQueries: Queries<$GCPCluster> = {
	/**
	 * Create insert query for GCPCluster
	 *
	 * @param config of cluster
	 * @param serviceAccountId
	 * @param nodesQuery the Edgedb query for inserting GCPCluster.nodes
	 * @returns insert query
	 */
	insertClusterQuery(
		config: {
			name: string;
			deploy_router: boolean;
			ip_allow_http: string[];
			ip_allow_ssh: string[];
			region: string;
			zone: string;
			machine_type: string;
		},
		serviceAccountId: string,
		nodesQuery: TypeSet<$InfernetNode, Cardinality.Many>
	) {
		return e.insert(e.GCPCluster, {
			...config,
			service_account: e.select(e.ServiceAccount, () => ({
				filter_single: { id: serviceAccountId },
			})),
			nodes: nodesQuery,
		});
	},
};
