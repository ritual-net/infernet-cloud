import { ClusterTypeByProvider, e, ServiceAccountTypeByProvider } from '$/lib/db';
import { getClusterSelectParams } from './components';
import type { Client } from 'edgedb';
import type { InfernetNode } from '$schema/interfaces';
import type { ProviderCluster, ProviderServiceAccount } from '$/types/provider';

/**
 * Get node data by node ids
 *
 * @param client The database client
 * @param nodeIds of nodes
 * @returns InfernetNodes array
 */
export const getNodesByIds = async (
	client: Client,
	nodeIds: string[],
	{
		includeClusterBacklink = false,
	}: {
		includeClusterBacklink?: boolean,
	} = {}
) => {
	return await e
		.params({ ids: e.array(e.uuid) }, ({ ids }) =>
			e.select(e.InfernetNode, (node) => ({
				...e.InfernetNode['*'],
				...includeClusterBacklink && {
					cluster: {
						id: true,
						name: true,
					},
				},
				docker_account: {
					username: true,
				},
				containers: {
					...e.Container['*'],
				},
				filter: e.op(node.id, 'in', e.array_unpack(ids)),
			}))
		)
		.run(client, { ids: nodeIds });
};

/**
 * Get service account data by id
 *
 * @param client The database client
 * @param id of ServiceAccount
 * @param creds whether to include sensitive Service Account credentials
 * @returns ProviderServiceAccount if found
 */
export const getServiceAccountById = async (
	client: Client,
	id: string,
	creds: boolean
): Promise<ProviderServiceAccount | null> => {
	// Get cloud provider from generic service account
	const generic = await e
		.select(e.ServiceAccount, () => ({
			provider: true,
			filter_single: { id },
		}))
		.run(client);

	if (!generic) {
		return null;
	}
	const provider = generic.provider;

	// Get service account with provider-specific data
	const result = await e
		.select(ServiceAccountTypeByProvider[provider], () => ({
			creds,
			user: {
				...e.User['*'],
			},
			filter_single: { id },
			...e.ServiceAccount['*'],
		}))
		.run(client);

	return result as ProviderServiceAccount | null;
};

/**
 * Get cluster data by id
 * 
 * @returns ProviderCluster if found
 */
export const getClusterById = async (
	/**
	 * The database client
	 */
	client: Client,

	/**
	 * Cluster ID
	 */
	id: string,

	{
		includeServiceAccountCredentials,
		includeNodeDetails,
		includeDockerAccountCredentials,
		includeTerraformDeploymentDetails,
	}: {
		/**
		 * Whether to include sensitive Service Account credentials
		 */
		includeServiceAccountCredentials: boolean,

		/**
		 * Whether to include Node and Container details
		 */
		includeNodeDetails: boolean,

		/**
		 * Whether to include Docker Credentials from Nodes
		 */
		includeDockerAccountCredentials?: boolean,

		/**
		 * Whether to include Terraform Deployment details
		 */
		includeTerraformDeploymentDetails?: boolean,
	},
): Promise<ProviderCluster | null> => {
	// Get cloud provider from generic cluster
	const generic = await e
		.select(e.Cluster, () => ({
			service_account: {
				provider: true,
			},
			filter_single: { id },
		}))
		.run(client);

	if (!generic) {
		return null;
	}
	const provider = generic.service_account.provider;

	// Get cluster with provider-specific data
	const cluster = await e
		.select(ClusterTypeByProvider[provider], () => ({
			...getClusterSelectParams(provider, {
				includeServiceAccountCredentials,
				includeNodeDetails,
				includeDockerAccountCredentials,
				includeTerraformDeploymentDetails,
			}),
			filter_single: { id },
		}))
		.run(client);

	return cluster as ProviderCluster | null;
};

/**
 * Get cluster data by node id
 *
 * @param client The database client
 * @param ids of node
 * @param creds whether to include sensitive Service Account credentials
 * @returns ProviderCluster if found
 * @throws Error if unable to find exactly one cluster for nodes
 */
export const getClusterByNodeIds = async (
	client: Client,
	ids: string[],
	includeServiceAccountCredentials = false
): Promise<ProviderCluster | null> => {
	const genericQuery = e.params({ ids: e.array(e.uuid) }, ({ ids }) =>
		e.select(e.Cluster, (cluster) => ({
			id: true,
			service_account: {
				provider: true,
			},
			filter: e.op(
				e.select(e.InfernetNode, (node) => ({
					id: true,
					filter: e.op(node.id, 'in', e.array_unpack(ids)),
				})),
				'in',
				cluster.nodes
			),
		}))
	);
	const generic = await genericQuery.run(client, { ids });
	if (!generic || generic.length !== 1) {
		throw Error('Unable to find exactly one cluster for nodes.');
	}
	const provider = generic[0].service_account.provider;
	const clusterId = generic[0].id;

	// Get cluster with provider-specific data
	const cluster = await e
		.select(ClusterTypeByProvider[provider], () => ({
			...getClusterSelectParams(provider, { includeServiceAccountCredentials }),
			filter_single: { id: clusterId },
		}))
		.run(client);
	return cluster as ProviderCluster | null;
};

/**
 * Get cluster data by router id
 *
 * @param client The database client
 * @param id of router
 * @param creds whether to include sensitive Service Account credentials
 * @returns ProviderCluster if found
 * @throws Error if unable to find exactly one cluster for router
 */
export const getClusterByRouterId = async (
	client: Client,
	id: string,
	includeServiceAccountCredentials = false
): Promise<ProviderCluster | null> => {
	const generic = await e
		.select(e.Cluster, (cluster) => ({
			id: true,
			service_account: {
				provider: true,
			},
			filter_single: e.op(cluster.router_status.id, '=', id),
		}))
		.run(client);

	if (!generic) {
		return null;
	}
	const clusterId = generic.id;
	const provider = generic.service_account.provider;

	// Get cluster with provider-specific data
	const cluster = await e
		.select(ClusterTypeByProvider[provider], () => ({
			...getClusterSelectParams(provider, { includeServiceAccountCredentials }),
			filter_single: { id: clusterId },
		}))
		.run(client);

	return cluster as ProviderCluster | null;
};

/**
 * Get clusters
 *
 * @param client The database client
 * @param {optional} serviceAccountId filter by clusters created with service account
 * @returns Cluster array
 */
export const getClusters = async (
	client: Client,
	serviceAccountId?: string,
) => (
	await e
		.select(e.Cluster, (cluster) => ({
			...serviceAccountId && {
				filter: e.op(cluster.service_account.id, '=', e.uuid(serviceAccountId)),
			},
			service_account: {
				id: true,
				name: true,
				provider: true,
			},
			id: true,
			name: true,
			node_count: e.count(cluster.nodes),
			status: true,
			locked: true,
		}))
		.run(client)
);
