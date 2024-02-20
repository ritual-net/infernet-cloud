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

	return json(await getClusterById(client, id, false));
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
 * @returns Success boolean and Terraform message.
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
	const cluster = await e
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

	if (!cluster) {
		return error(500, 'Failed to update cluster');
	}

	// Apply Terraform changes to cluster
	const { error: errorMessage, success } = await clusterAction(client, cluster.id, TFAction.Apply);
	return json({
		message: success ? 'Cluster updated successfully' : errorMessage,
		success,
	});
};

/**
 * Delete a cluster by its ID.
 *
 * @param locals - The locals object contains the client.
 * @param params - The parameters object, expected to contain 'clusterId'.
 * @returns Success boolean and Terraform message.
 */
export const DELETE: RequestHandler = async ({ locals: { client }, params }) => {
	const id = params.clusterId;

	if (!id) {
		return error(400, 'Cluster id is required');
	}

	// Apply Terraform changes to cluster
	const { error: errorMessage, success } = await clusterAction(client, id, TFAction.Destroy);

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
