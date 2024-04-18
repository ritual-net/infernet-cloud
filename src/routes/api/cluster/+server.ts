// Types
import z from 'yup';
import type { FormData as CreateClusterFormData } from '$/routes/(signedIn)/clusters/create/schema';
import { TFAction } from '$/types/terraform';
import type { Cluster } from '$schema/interfaces';
import type { RequestHandler } from '@sveltejs/kit';


// Functions
import { error, json } from '@sveltejs/kit';
import { e, ClusterTypeByProvider } from '$/lib/db';
import { clusterAction } from '$/lib/terraform/common';
import { createNodeParams, insertNodeQuery } from '$/lib/db/components';
import { getServiceAccountById, getClustersForUser } from '$/lib/db/queries';


/**
 * Fetch all clusters for a user.
 *
 * @param locals - The locals object contains the client.
 * @returns Array of Cluster objects.
 */
export const GET: RequestHandler = async ({ locals: { client } }) => {
	// Get all clusters for user
	const result = await getClustersForUser(client)

	return json(result);
};

/**
 * Create a new cluster with a given service account and an array of node configs.
 *
 * @param locals - The locals object contains the client.
 * @param request - The request object containing 'serviceAccountId', 'config', 'nodes'.
 * @returns Cluster ID, success boolean, and Terraform message.
 */
export const POST: RequestHandler = async ({ locals: { client }, request }) => {
	const { serviceAccountId, config, nodes } = await request.json() as z.InferType<typeof CreateClusterFormData>;

	if (!serviceAccountId || !config || !nodes || !Array.isArray(nodes) || nodes.length === 0) {
		return error(400, 'Service account and at least one node are required');
	}

	// EdgeDB doesn't yet allow optional values within tuples.
	// https://github.com/edgedb/rfcs/blob/master/text/1022-freetypes.rst
	// Manually initialize nested undefined keys that were omitted from JSON serialization
	for(const node of nodes){
		node.snapshot_sync.sleep ??= 1.0
		node.snapshot_sync.batch_size ??= 200
	}

	// Get provider of service account
	const serviceAccount = await getServiceAccountById(client, serviceAccountId, true);
	if (!serviceAccount) {
		return error(400, 'Service account could not be retrieved');
	}

	let cluster: Cluster

	try {
		// Exclude zone (unused by backend)
		if(serviceAccount.provider === 'AWS')
			delete config.zone

		// Insert cluster
		cluster = (await e
			.params(
				{
					nodes: e.array(createNodeParams),
				},
				({ nodes }) =>
					// Choose cluster type based on provider
					e.insert(ClusterTypeByProvider[serviceAccount.provider], {
						...config,
						service_account: e.select(e.ServiceAccount, () => ({
							filter_single: { id: serviceAccountId },
						})),
						nodes: e.for(e.array_unpack(nodes), (node) => insertNodeQuery(node)),
					})
			)
			.run(client, { nodes })) as Cluster;
	} catch (e) {
		console.error(e)

		if(e.message?.includes(`violates exclusivity constraint`)){
			return error(500, `A cluster with name "${config.name}" already exists.`)
		}

		return error(500, (e as Error).message);
	}

	// Apply Terraform changes to created cluster
	// (Run in background - don't block API response)
	(async () => {
		let result: Awaited<ReturnType<typeof clusterAction>>

		try {
			result = await clusterAction(
				client,
				cluster.id,
				TFAction.Apply
			);
		} catch (e) {
			console.error(e)

			// return error(500, JSON.stringify(e))
		}

		// const { success, error: errorMessage } = result

		// if(!success)
		// 	return error(500, errorMessage)
	})();

	return json({
		cluster,
	})
};
