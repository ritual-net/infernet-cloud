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

	return json(await getClusterById(client, id, {
		includeServiceAccountCredentials: false,
		includeNodeDetails: false,
		includeTerraformDeploymentDetails: true,
	}))
};

/**
 * Apply Terraform changes to cluster.
 *
 * @param locals - The locals object contains the client.
 * @param params - The parameters object, expected to contain 'clusterId'.
 * @returns Cluster object.
 */
export const POST: RequestHandler = async ({
	locals: { client },
	params,
	url,
}) => {
	const clusterId = params.clusterId

	if (!clusterId)
		return error(400, 'Cluster id is required')

	const action = (
		url.searchParams.has('destroy')
			? TFAction.Destroy
			: TFAction.Apply
	)

	let result: Awaited<ReturnType<typeof clusterAction>>

	try {
		result = await clusterAction(
			client,
			clusterId,
			action
		)
	} catch (e) {
		console.error(e)

		return error(500, e)
	}

	if(result.error)
		return error(500, result.error)

	return json(await getClusterById(client, clusterId, {
		includeServiceAccountCredentials: false,
		includeNodeDetails: false,
		includeTerraformDeploymentDetails: true,
	}))
};

/**
 * Update a cluster by its ID.
 *
 * @param locals - The locals object contains the client.
 * @param params - The parameters object, expected to contain 'clusterId'.
 * @param request - The request body can contain the following updateable fields:
 * 					- name: string
 * 					- deploy_router: boolean
 * 					- ip_allow_http: string[]
 * 					- ip_allow_ssh: string[]
 * @returns Updated cluster ID.
 */
export const PATCH: RequestHandler = async ({
	locals: { client },
	params,
	request,
}) => {
	const id = params.clusterId;
	if (!id)
		return error(400, 'Cluster id is required')

	const body = await request.json()
	if (!body)
		return error(400, 'Body is required')

	const { config, router } = body

	const { deploy_router, ...clusterConfig } = config

	// Update cluster
	const updatedCluster = await e
		.update(e.Cluster, (c) => ({
			set: {
				...clusterConfig,
				router: (
					deploy_router
						? e.tuple({
							region: router.region,
							zone: router.zone,
							machine_type: router.machine_type,
						})
						: e.set()
				),
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
			)
		} catch (e) {
			console.error(e)
		}

		if(result?.error)
			return error(500, result.error)
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

	if (!id)
		return error(400, 'Cluster id is required')

	const cluster = await e.select(e.Cluster, (cluster) => ({
		filter_single: {
			id: e.uuid(id)
		},
		locked: true,
		status: true,
	}))
		.run(client)

	if (!cluster)
		return error(400, 'No cluster to delete.')

	if(cluster.locked)
		return error(500, `The cluster is already in the process of being updated. Please wait and try again.`)

	if(cluster.status !== 'destroyed')
		return error(500, `Cannot delete cluster that has not been destroyed.`)

	// Delete cluster, nodes and containers deleted through cascade
	const deletedCluster = await e
		.delete(e.Cluster, (cluster) => ({
			filter_single: e.op(cluster.id, '=', e.uuid(id)),
		}))
		.run(client);

	if(!deletedCluster)
		return error(500, 'No cluster was deleted.')

	return json({
		cluster: deletedCluster
	})
};
