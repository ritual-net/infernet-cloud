import { client, e } from '$lib/db';
import type { AWSCluster, AWSServiceAccount } from '$schema/interfaces';
import type { Queries } from '$lib/db/base';
import type { TypeSet } from '$schema/edgeql-js/reflection';

export const AWSQueries: Queries = {
	/**
	 * Get service account data by id
	 * @param id of AWSServiceAccount
	 * @returns AWSServiceAccount if found
	 */
	async getServiceAccountById(id: string): Promise<AWSServiceAccount | null> {
		return await e
			.select(e.AWSServiceAccount, () => ({
				...e.AWSServiceAccount['*'],
				user: {
					...e.User['*'],
				},
				filter_single: { id },
			}))
			.run(client);
	},

	/**
	 * Get cluster data by id
	 * @param id of AWSCluster
	 * @returns AWSCluster if found
	 */
	async getClusterById(id: string): Promise<AWSCluster | null> {
		return await e
			.select(e.AWSCluster, () => ({
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
				filter_single: { id },
			}))
			.run(client);
	},

	/**
	 * Get cluster data by node id
	 * @param id of node
	 * @returns AWSCluster if found
	 */
	async getClusterByNodeId(id: string): Promise<AWSCluster | null> {
		const node = e.select(e.InfernetNode, () => ({
			filter_single: { id },
		}));

		// Get cluster id and service account
		const clusters = await e
			.with(
				[node],
				e.select(e.AWSCluster, (cluster) => ({
					id: true,
					service_account: {
						id: true,
						provider: true,
					},
					filter: e.op(node, 'in', cluster.nodes),
				}))
			)
			.run(client);
		if (clusters.length === 0) {
			return null;
		}
		return clusters[0] as AWSCluster;
	},

	/**
	 * Create insert query for AWSCluster
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		nodesQuery: TypeSet<any, any>
	) {
		return e.insert(e.AWSCluster, {
			...config,
			service_account: e.select(e.ServiceAccount, () => ({
				filter_single: { id: serviceAccountId },
			})),
			nodes: nodesQuery,
		});
	},

	/**
	 * Create insert query for single AWSCluster node
	 * @param clusterId associated with node
	 * @param nodeQuery the Edgedb query for inserting an InfernetNode
	 * @returns insert query
	 */
	insertNodeToClusterQuery(
		clusterId: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		nodeQuery: TypeSet<any, any>
	) {
		return e.update(e.AWSCluster, () => ({
			set: {
				nodes: { '+=': nodeQuery },
			},
			filter_single: { id: clusterId },
		}));
	},
};
