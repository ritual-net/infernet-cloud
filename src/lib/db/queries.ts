import { client, e } from '$/lib/db';
import { getClusterSelectParams } from './components';
import type { InfernetNode } from '$schema/interfaces';
import type { ProviderCluster, ProviderServiceAccount } from '$/types/provider';

/**
 * Get node data by node ids
 *
 * @param nodeIds of nodes
 * @returns InfernetNodes array
 */
export const getNodesByIds = async (nodeIds: string[]): Promise<InfernetNode[] | null> => {
	const query = e.params({ ids: e.array(e.uuid) }, ({ ids }) =>
		e.select(e.InfernetNode, () => ({
			...e.InfernetNode['*'],
			containers: {
				...e.Container['*'],
			},
			filter: e.op(e.InfernetNode.id, 'in', e.array_unpack(ids)),
		}))
	);
	const nodes = await query.run(client, { ids: nodeIds });
	return nodes.length > 0 ? nodes : null;
};

/**
 * Get service account data by id
 *
 * @param id of ServiceAccount
 * @returns ProviderServiceAccount if found
 */
export async function getServiceAccountById(id: string): Promise<ProviderServiceAccount | null> {
	const result = await e
		.select(e.ServiceAccount, () => ({
			user: {
				...e.User['*'],
			},
			...e.ServiceAccount['*'],
			...e.is(e.AWSServiceAccount, { creds: true }),
			...e.is(e.GCPServiceAccount, { creds: true }),
			filter_single: { id },
		}))
		.run(client);

	return result && (result as ProviderServiceAccount);
}

/**
 * Get cluster data by id
 *
 * @param id of Cluster
 * @param creds whether to include sensitive Service Account credentials
 * @returns ProviderCluster if found
 */
export async function getClusterById(id: string, creds: boolean): Promise<ProviderCluster | null> {
	return (await e
		.select(e.Cluster, () => ({
			...getClusterSelectParams(creds),
			filter_single: { id },
		}))
		.run(client)) as ProviderCluster;
}

/**
 * Get cluster data by node id
 *
 * @param nodeId of node
 * @returns ProviderCluster if found
 */
export async function getClusterByNodeId(id: string): Promise<ProviderCluster | null> {
	const node = e.select(e.InfernetNode, () => ({
		filter_single: { id },
	}));

	// Get cluster id and service account
	const clusters = await e
		.with(
			[node],
			e.select(e.Cluster, (cluster) => ({
				...getClusterSelectParams(false),
				filter: e.op(node, 'in', cluster.nodes),
			}))
		)
		.run(client);
	return clusters.length > 0 ? (clusters[0] as ProviderCluster) : null;
}
