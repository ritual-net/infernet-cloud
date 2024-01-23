import type { GCPCluster, GCPServiceAccount } from '$schema/interfaces';
import { client, e } from '.';
import type { Queries } from './base';

export class GCPQueries implements Queries {
	/**
	 * Get service account data by id
	 * @param id of GCPServiceAccount
	 * @returns GCPServiceAccount if found
	 */
	public async getServiceAccountById(id: string): Promise<GCPServiceAccount | null> {
		const result = await e
			.select(e.GCPServiceAccount, () => ({
				...e.GCPServiceAccount['*'],
				user: {
					...e.User['*']
				},
				filter_single: { id }
			}))
			.run(client);

		return result;
	}

	/**
	 * Get cluster data by id
	 * @param id of GCPCluster
	 * @returns GCPCluster if found
	 */
	public async getClusterById(id: string): Promise<GCPCluster | null> {
		return await e
			.select(e.GCPCluster, () => ({
				service_account: {
					id: true,
					name: true,
					provider: true,
					user: {
						...e.User['*']
					}
				},
				nodes: {
					...e.InfernetNode['*'],
					containers: {
						...e.Container['*']
					}
				},
				...e.GCPCluster['*'],
				filter_single: { id }
			}))
			.run(client);
	}

	/**
	 * Create insert query for GCPCluster
	 * @param config of cluster
	 * @param service_account
	 * @param nodesQuery
	 * @returns insert query
	 */
	public insertClusterQuery(
		config: {
			name: string;
			deploy_router: boolean;
			ip_allow_http: string[];
			ip_allow_ssh: string[];
			region: string;
			zone: string;
			machine_type: string;
		},
		service_account: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		nodesQuery: any
	) {
		return e.insert(e.GCPCluster, {
			...config,
			service_account: e.select(e.ServiceAccount, () => ({
				filter_single: { id: service_account }
			})),
			nodes: nodesQuery
		});
	}
}
