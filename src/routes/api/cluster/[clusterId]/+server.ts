import { error, json } from '@sveltejs/kit';
import { getClusterById } from '$/lib/db/queries';
import { client, e } from '$/lib/db';
import { clusterAction } from '$/lib/terraform/common';
import { TFAction } from '$/types/terraform';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Retrieve a cluster by its ID.
 *
 * @param params - The parameters object, expected to contain 'clusterId'.
 * @returns Cluster object.
 */
export const GET: RequestHandler = async ({ params }) => {
	const id = params.clusterId;

	if (!id) {
		return error(400, 'Cluster id is required');
	}

	// TODO: Make sure cluster belongs to user through auth

	return json(await getClusterById(id, false));
};

/**
 * Update a cluster by its ID.
 *
 * @param params - The parameters object, expected to contain 'clusterId'.
 * @param request - The request object can contain the following updateable fields:
 * 					- name: string
 * 					- deploy_router: boolean
 * 					- ip_allow_http: string
 * 					- ip_allow_https: string
 * @returns Success boolean and Terraform message.
 */
export const PATCH: RequestHandler = async ({ params, request }) => {
	const id = params.clusterId;

	if (!id) {
		return error(400, 'Cluster id is required');
	}

	// TODO: Make sure cluster belongs to user through auth

	const data = await request.json();
	if (!data || data.length === 0) {
		return error(400, 'At least one field is required');
	}

	// Update cluster
	const cluster = await e
		.update(e.Cluster, (c) => ({
			set: {
				// Updateable fields, default to current value if not provided
				name: e.op(data.name, '??', c.name),
				deploy_router: e.op(data.deploy_router, '??', c.deploy_router),
				...(data?.ip_allow_http && { ip_allow_http: data.ip_allow_http }),
				...(data?.ip_allow_https && { ip_allow_https: data.ip_allow_https }),
			},
			filter_single: { id },
		}))
		.run(client);

	if (!cluster) {
		return error(500, 'Failed to update cluster');
	}

	// Apply Terraform changes to cluster
	const { error: errorMessage, success } = await clusterAction(cluster.id, TFAction.Apply);
	return json({
		message: success ? 'Cluster updated successfully' : errorMessage,
		success,
	});
};

/**
 * Delete a cluster by its ID.
 *
 * @param params - The parameters object, expected to contain 'clusterId'.
 * @returns Success boolean and Terraform message.
 */
export const DELETE: RequestHandler = async ({ params }) => {
	const id = params.clusterId;

	if (!id) {
		return error(400, 'Cluster id is required');
	}

	// TODO: confirm cluster belongs to user through auth

	// Apply Terraform changes to cluster
	const { error: errorMessage, success } = await clusterAction(id, TFAction.Destroy);

	if (success) {
		// Delete cluster, nodes and containers deleted through cascade
		await e
			.delete(e.Cluster, (cluster) => ({
				filter_single: e.op(cluster.id, '=', e.uuid(id)),
			}))
			.run(client);
	}

	return json({
		message: success ? 'Cluster destroyed successfully' : errorMessage,
		success,
	});
};
