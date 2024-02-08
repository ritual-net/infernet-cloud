import type { Client } from 'edgedb';
import { ClusterTypeByProvider, e, ServiceAccountTypeByProvider } from '$/lib/db';
import { getClusterSelectParams } from './components';
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
	nodeIds: string[]
): Promise<InfernetNode[] | null> => {
	const query = e.params({ ids: e.array(e.uuid) }, ({ ids }) =>
		e.select(e.InfernetNode, (node) => ({
			...e.InfernetNode['*'],
			containers: {
				...e.Container['*'],
			},
			filter: e.op(node.id, 'in', e.array_unpack(ids)),
		}))
	);
	const nodes = await query.run(client, { ids: nodeIds });
	return nodes.length > 0 ? nodes : null;
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
 * @param client The database client
 * @param id of Cluster
 * @param creds whether to include sensitive Service Account credentials
 * @returns ProviderCluster if found
 */
export const getClusterById = async (
	client: Client,
	id: string,
	creds: boolean
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
	const result = await e
		.select(ClusterTypeByProvider[provider], () => ({
			...getClusterSelectParams(creds, provider),
			filter_single: { id },
		}))
		.run(client);

	return result && (result as ProviderCluster);
};

/**
 * Get cluster data by node id
 *
 * @param client The database client
 * @param id of node
 * @param creds whether to include sensitive Service Account credentials
 * @returns ProviderCluster if found
 */
export const getClusterByNodeId = async (
	client: Client,
	id: string,
	creds = false
): Promise<ProviderCluster | null> => {
	// Get cloud provider from generic cluster
	const generic = await e
		.select(e.Cluster, (cl) => ({
			id: true,
			service_account: {
				provider: true,
			},
			filter_single: e.op(e.uuid(id), 'in', cl.nodes.id),
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
			...getClusterSelectParams(creds, provider),
			filter_single: { id: clusterId },
		}))
		.run(client);
	return cluster as ProviderCluster | null;
};
