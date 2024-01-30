import { client, e } from '$lib/db';
import type { GCPCluster, GCPServiceAccount } from '$schema/interfaces';
import type { Queries } from '$lib/db/base';
import type { TypeSet } from '$schema/edgeql-js/reflection';
import type { GpuCount } from 'aws-sdk/clients/computeoptimizer';

export const GCPQueries: Queries = {
	/**
	 * Get service account data by id
	 * @param id of GCPServiceAccount
	 * @returns GCPServiceAccount if found
	 */
	async getServiceAccountById(id: string): Promise<GCPServiceAccount | null> {
		const result = await e
			.select(e.GCPServiceAccount, () => ({
				...e.GCPServiceAccount['*'],
				user: {
					...e.User['*'],
				},
				filter_single: { id },
			}))
			.run(client);

		return result;
	},

	/**
	 * Get cluster data by id
	 * @param id of GCPCluster
	 * @returns GCPCluster if found
	 */
	async getClusterById(id: string): Promise<GCPCluster | null> {
		return await e
			.select(e.GCPCluster, () => ({
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
				...e.GCPCluster['*'],
				filter_single: { id },
			}))
			.run(client);
	},

	/**
	 * Get cluster data by node id
	 * @param id of node
	 * @returns GCPCluster if found
	 */
	async getClusterByNodeId(id: string): Promise<GCPCluster | null> {
		const node = e.select(e.InfernetNode, () => ({
			filter_single: { id },
		}));

		// Get cluster id and service account
		const clusters = await e
			.with(
				[node],
				e.select(e.GCPCluster, (cluster) => ({
					...e.GCPCluster['*'],
					service_account: {
						...e.ServiceAccount['*'],
					},
					filter: e.op(node, 'in', cluster.nodes),
				}))
			)
			.run(client);
		return clusters ? clusters[0] as GCPCluster : null;
	},

	/**
	 * Create insert query for GCPCluster
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		nodesQuery: TypeSet<any, any>
	) {
		return e.insert(e.GCPCluster, {
			...config,
			service_account: e.select(e.ServiceAccount, () => ({
				filter_single: { id: serviceAccountId },
			})),
			nodes: nodesQuery,
		});
	},

	/**
	 * Create insert query for single GCPCluster node
	 * @param clusterId associated with node
	 * @param nodeQuery the Edgedb query for inserting an InfernetNode
	 * @returns insert query
	 */
	insertNodeToClusterQuery(
		clusterId: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		nodeQuery: TypeSet<any, any>
	) {
		return e.update(e.GCPCluster, () => ({
			set: {
				nodes: { '+=': nodeQuery },
			},
			filter_single: { id: clusterId },
		}));
	},
};
