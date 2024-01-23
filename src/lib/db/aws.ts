import type { AWSCluster, AWSServiceAccount } from '$schema/interfaces';
import { client, e } from '.';
import type { Queries } from './base';

export class AWSQueries implements Queries {
	/**
	 * Get service account data by id
	 * @param id of AWSServiceAccount
	 * @returns AWSServiceAccount if found
	 */
	public async getServiceAccountById(id: string): Promise<AWSServiceAccount | null> {
		const result = await e
			.select(e.AWSServiceAccount, () => ({
				...e.AWSServiceAccount['*'],
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
	 * @param id of AWSCluster
	 * @returns AWSCluster if found
	 */
	public async getClusterById(id: string): Promise<AWSCluster | null> {
		return await e
			.select(e.AWSCluster, () => ({
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
				...e.AWSCluster['*'],
				filter_single: { id }
			}))
			.run(client);
	}

	/**
	 * Create insert query for AWSCluster
	 * @param config of cluster
	 * @param service_account associated with cluster
	 * @param nodesQuery for inserting cluster nodes
	 * @returns insert query
	 */
	public insertClusterQuery(
		config: {
			name: string;
			deploy_router: boolean;
			ip_allow_http: string[];
			ip_allow_ssh: string[];
			region: string;
			machine_type: string;
		},
		service_account: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		nodesQuery: any
	) {
		return e.insert(e.AWSCluster, {
			...config,
			service_account: e.select(e.ServiceAccount, () => ({
				filter_single: { id: service_account }
			})),
			nodes: nodesQuery
		});
	}
}
