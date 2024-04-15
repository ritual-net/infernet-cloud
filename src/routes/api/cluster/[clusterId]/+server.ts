import { error, json } from '@sveltejs/kit';
import { clusterAction } from '$/lib/terraform/common';
import { e } from '$/lib/db';
import { getClusterById } from '$/lib/db/queries';
import { TFAction } from '$/types/terraform';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Retrieve a cluster by its ID.
 *
 * @param locals - The locals object contains the client.
 * @param params - The parameters object, expected to contain 'clusterId'.
 * @returns Cluster object.
 */
export const GET: RequestHandler = async ({ locals: { client }, params }) => {
	const id = params.clusterId;

	if (!id) {
		return error(400, 'Cluster id is required');
	}

	return json(await getClusterById(client, id, { includeServiceAccountCredentials: false, includeNodeDetails: false }));
};

/**
 * Apply Terraform changes to cluster.
 *
 * @param locals - The locals object contains the client.
 * @param params - The parameters object, expected to contain 'clusterId'.
 * @returns Cluster object.
 */
export const POST: RequestHandler = async ({ locals: { client }, params }) => {
	const clusterId = params.clusterId;

	if (!clusterId) {
		return error(400, 'Cluster id is required');
	}

	let result: Awaited<ReturnType<typeof clusterAction>>

	try {
		result = await clusterAction(
			client,
			clusterId,
			TFAction.Apply
		);
	} catch (e) {
		console.error(e)

		return error(500, e)
	}

	const { success, error: _error } = result

	if(!success)
		return error(500, _error)

	return json(await getClusterById(client, clusterId, { includeServiceAccountCredentials: false, includeNodeDetails: false }));
};

/**
 * Update a cluster by its ID.
 *
 * @param locals - The locals object contains the client.
 * @param params - The parameters object, expected to contain 'clusterId'.
 * @param request - The request body can contain the following updateable fields:
 * 					- name: string
 * 					- deploy_router: boolean
 * 					- ip_allow_http: string
 * 					- ip_allow_https: string
 * @returns Updated cluster ID.
 */
export const PATCH: RequestHandler = async ({ locals: { client }, params, request }) => {
	const id = params.clusterId;
	if (!id) {
		return error(400, 'Cluster id is required');
	}

	const body = await request.json();
	if (!body) {
		return error(400, 'Body is required');
	}

	// Update cluster
	const updatedCluster = await e
		.update(e.Cluster, (c) => ({
			set: {
				// Updateable fields, default to current value if not provided
				name: e.op(body.name, '??', c.name),
				deploy_router: e.op(body.deploy_router, '??', c.deploy_router),
				...(body?.ip_allow_http && { ip_allow_http: body.ip_allow_http }),
				...(body?.ip_allow_https && { ip_allow_https: body.ip_allow_https }),
			},
			filter_single: { id },
		}))
		.run(client);

	if (!updatedCluster)
		return error(500, 'Failed to update cluster');

	// Apply Terraform changes to updated cluster
	// (Run in background - don't block API response)
	(async () => {
		let result: Awaited<ReturnType<typeof clusterAction>>

		try {
			result = await clusterAction(
				client,
				updatedCluster.id,
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
		cluster: updatedCluster,
	})
};

/**
 * Delete a cluster by its ID.
 *
 * @param locals - The locals object contains the client.
 * @param params - The parameters object, expected to contain 'clusterId'.
 * @returns Deleted cluster ID.
 */
export const DELETE: RequestHandler = async ({ locals: { client }, params }) => {
	const id = params.clusterId;

	if (!id) {
		return error(400, 'Cluster id is required');
	}

	let result: Awaited<ReturnType<typeof clusterAction>>
	
	try {
		// Apply Terraform changes to cluster
		result = await clusterAction(
			client,
			id,
			TFAction.Destroy
		);
	} catch (e) {
		console.error(e)

		return error(500, JSON.stringify(e))
	}

	const { success, error: errorMessage } = result

	if(!success)
		return error(500, errorMessage)

	// Delete cluster, nodes and containers deleted through cascade
	const deletedCluster = await e
		.delete(e.Cluster, (cluster) => ({
			filter_single: e.op(cluster.id, '=', e.uuid(id)),
		}))
		.run(client);

	if(!deletedCluster)
		return error(500, 'No cluster to delete.')

	return json({
		cluster: deletedCluster
	})
};
